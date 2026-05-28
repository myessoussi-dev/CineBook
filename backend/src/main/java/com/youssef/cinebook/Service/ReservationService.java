package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.ReservationDTO;
import com.youssef.cinebook.Entity.*;
import com.youssef.cinebook.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;
    private final SessionRepository sessionRepository;
    private final EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              SeatRepository seatRepository,
                              ReservationSeatRepository reservationSeatRepository,
                              SessionRepository sessionRepository,
                              EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.seatRepository = seatRepository;
        this.reservationSeatRepository = reservationSeatRepository;
        this.sessionRepository=sessionRepository;
        this.emailService=emailService;
    }
    @Transactional
    public void addReservation(ReservationDTO reservationDTO){
        User user=userRepository.getReferenceById(reservationDTO.getUserId());
        List<Seat> seats=reservationDTO.getSeatIds().stream().
                map(seatRepository::getReferenceById).toList();
        Session session=sessionRepository.getReferenceById(reservationDTO.getSessionId());
        for (Seat seat : seats) {

            boolean reserved =
                    reservationSeatRepository
                            .existsBySeatIdAndSessionId(
                                    seat.getId(),
                                    session.getId()
                            );

            if (reserved) {
                throw new RuntimeException(
                        "Seat already reserved"
                );
            }
        }
        Reservation reservation=new Reservation();
        reservation.setUser(user);
        reservation.setSession(session);
        reservation.setPrice(reservationDTO.getPrice());
        reservation=reservationRepository.save(reservation);
        List<ReservationSeat> reservationSeatList=new ArrayList<>();
        for (Seat seat : seats) {
            ReservationSeat reservationSeat=new ReservationSeat();
            reservationSeat.setReservation(reservation);
            reservationSeat.setSession(session);
            reservationSeat.setSeat(seat);
            reservationSeatList.add(reservationSeat);
        }
        reservationSeatRepository.saveAll(reservationSeatList);

        String destinataire    = reservation.getUser().getEmail();
        String nomUtilisateur  = reservation.getUser().getFullName();
        String film            = reservation.getSession().getMovie().getTitle();
        String posterPath      = reservation.getSession().getMovie().getPosterPath();
        String date            = reservation.getSession().getStartTime().getDayOfWeek().toString();
        String heure           = reservation.getSession().getStartTime().getHour() + "h00";
        String salle           = reservation.getSession().getRoom().getName();
        String prix            = reservation.getPrice().toString();
        Long   numeroRes       = reservation.getId();

        String siegesBadges = reservationSeatList.stream()
                .map(s -> "<span style='background:#e94560; color:white; padding:4px 12px; " +
                        "border-radius:12px; margin:3px; display:inline-block; font-weight:bold;'>" +
                        s.getSeat().getRowSeat() + s.getSeat().getColumnSeat() + "</span>")
                .collect(Collectors.joining(" "));

        emailService.envoyerConfirmationReservation(
                destinataire, nomUtilisateur, film, posterPath,
                date, heure, salle, siegesBadges, prix, numeroRes
        );

    }

}

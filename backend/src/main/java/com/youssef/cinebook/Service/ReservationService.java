package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.ReservationDTO;
import com.youssef.cinebook.Entity.*;
import com.youssef.cinebook.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;
    private final SessionRepository sessionRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              SeatRepository seatRepository,
                              ReservationSeatRepository reservationSeatRepository,
                              SessionRepository sessionRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.seatRepository = seatRepository;
        this.reservationSeatRepository = reservationSeatRepository;
        this.sessionRepository=sessionRepository;
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
    }

}

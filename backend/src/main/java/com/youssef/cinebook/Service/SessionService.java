package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.SeatDTO;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Entity.ReservationSeat;
import com.youssef.cinebook.Entity.Session;
import com.youssef.cinebook.Mapper.SeatMapper;
import com.youssef.cinebook.Repository.ReservationSeatRepository;
import com.youssef.cinebook.Repository.SeatRepository;
import com.youssef.cinebook.Repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;
    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    public SessionService(SessionRepository sessionRepository, SeatRepository seatRepository,
                          ReservationSeatRepository reservationSeatRepository) {
        this.sessionRepository = sessionRepository;
        this.seatRepository = seatRepository;
        this.reservationSeatRepository=reservationSeatRepository;
    }

    public List<SeatDTO> getRoomSeats(Long sessionId) {
        Session session = sessionRepository.findById(sessionId).orElse(null);
        if (session != null) {
            return seatRepository.findByRoomId(session.getRoom().getId()).
                    stream().map(SeatMapper::SeatToDTO).toList();
        }
        return new ArrayList<>();
    }
    public Session getSessionDetails(Long id){
        return sessionRepository.findById(id).orElse(null);
    }

    public List<SeatDTO> getReservedSeats(Long id){
        return reservationSeatRepository.findBySessionId(id).stream().
                map(ReservationSeat::getSeat)
                .map(SeatMapper::SeatToDTO).toList();

    }

    public List<Session> getAvailableSessions() {
        return sessionRepository.findByMovieStatusAndStartTimeGreaterThanEqual(Movie.MovieStatus.AVAILABLE, LocalDateTime.now());
    }
}

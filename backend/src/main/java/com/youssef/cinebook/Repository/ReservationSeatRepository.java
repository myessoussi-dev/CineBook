package com.youssef.cinebook.Repository;

import com.youssef.cinebook.Entity.ReservationSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationSeatRepository extends JpaRepository<ReservationSeat,Long> {
     List<ReservationSeat> findBySessionId(Long sessionId);

     boolean existsBySeatIdAndSessionId(Long id, Long id1);
}

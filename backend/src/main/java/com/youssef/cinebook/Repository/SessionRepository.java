package com.youssef.cinebook.Repository;

import com.youssef.cinebook.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session,Long> {
    public List<Session> findByMovieIdAndStartTimeGreaterThanEqual(Long id, LocalDateTime startTime);
}

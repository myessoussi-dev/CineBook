package com.youssef.cinebook.Repository;

import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
    public List<Session> findByMovieIdAndStartTimeGreaterThanEqual(Long id, LocalDateTime startTime);

    List<Session> findByMovieStatusAndStartTimeGreaterThanEqual(Movie.MovieStatus movieStatus, LocalDateTime startTime);
}

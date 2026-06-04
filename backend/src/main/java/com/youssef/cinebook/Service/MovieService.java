package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.SessionDTO;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Mapper.SessionMapper;
import com.youssef.cinebook.Repository.MovieRepository;
import com.youssef.cinebook.Repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final SessionRepository sessionRepository;

    public MovieService(MovieRepository movieRepository,
                        SessionRepository sessionRepository) {
        this.movieRepository = movieRepository;
        this.sessionRepository=sessionRepository;
    }
    public List<Movie> getNowPlayingMovies(){
        return movieRepository.findByStatus(Movie.MovieStatus.AVAILABLE);
    }
    public List<Movie> getUpcomingMovies(){return movieRepository.findByStatus(Movie.MovieStatus.COMING_SOON);}

    public Movie getMovieDetails(Long id) {
        return movieRepository.findById(id).
                orElseThrow(()->new RuntimeException("Movie not found!"));
    }
    public List<SessionDTO> getMovieSessions(Long movieId){
        return sessionRepository.
                findByMovieIdAndStartTimeGreaterThanEqual(movieId,
                LocalDateTime.now()).stream().map(SessionMapper::SessionToDTO).toList();
    }
}

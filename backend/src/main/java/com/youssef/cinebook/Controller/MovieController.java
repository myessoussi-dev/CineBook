package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.SessionDTO;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins ="*")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }
    @GetMapping
    public List<Movie> getNowPlyingMovies(){
        return movieService.getNowPlayingMovies();
    }
    @GetMapping("/upcoming")
    public List<Movie> getUpComingMovies(){
        return movieService.getUpcomingMovies();
    }
    @GetMapping("/{id}")
    public Movie getMovieDetails(@PathVariable Long id){
        return movieService.getMovieDetails(id);
    }
    @GetMapping("/{id}/sessions")
    public List<SessionDTO> getMovieSessions(@PathVariable Long id){
        return movieService.getMovieSessions(id);
    }

}

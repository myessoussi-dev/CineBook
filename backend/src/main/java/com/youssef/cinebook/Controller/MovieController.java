package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.SessionDTO;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Entity.Session;
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
    public List<Movie> getAllMovies(){
        return movieService.getAllMovies();
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

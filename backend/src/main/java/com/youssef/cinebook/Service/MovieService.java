package com.youssef.cinebook.Service;

import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Repository.CategoryRepository;
import com.youssef.cinebook.Repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    public MovieService(MovieRepository movieRepository, CategoryRepository categoryRepository) {
        this.movieRepository = movieRepository;
        this.categoryRepository = categoryRepository;
    }
    public List<Movie> getAllMovies(){
        return movieRepository.findAll();
    }

    public Movie getMovieDetails(Long id) {
        return movieRepository.findById(id).
                orElseThrow(()->new RuntimeException("Movie not found!"));
    }
}

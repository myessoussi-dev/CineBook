package com.youssef.cinebook.Service;

import com.youssef.cinebook.Repository.MovieRepository;
import com.youssef.cinebook.TmdbClient;
import org.springframework.stereotype.Service;

@Service
public class TmdbToBd {
    private final TmdbClient tmdbClient;
    private final MovieRepository movieRepository;

    public TmdbToBd(TmdbClient tmdbClient, MovieRepository movieRepository) {
        this.tmdbClient = tmdbClient;
        this.movieRepository = movieRepository;
    }
}

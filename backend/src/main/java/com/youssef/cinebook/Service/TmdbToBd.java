package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.CategoryApi;
import com.youssef.cinebook.DTO.MovieDetailsApi;
import com.youssef.cinebook.DTO.VideoTeaser;
import com.youssef.cinebook.Entity.Category;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Mapper.CategoryMapper;
import com.youssef.cinebook.Mapper.MovieMapper;
import com.youssef.cinebook.Repository.CategoryRepository;
import com.youssef.cinebook.Repository.MovieRepository;
import com.youssef.cinebook.TmdbClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Transactional
@Service
public class TmdbToBd {
    private final TmdbClient tmdbClient;
    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    public TmdbToBd(TmdbClient tmdbClient, MovieRepository movieRepository, CategoryRepository categoryRepository) {
        this.tmdbClient = tmdbClient;
        this.movieRepository = movieRepository;
        this.categoryRepository = categoryRepository;
    }

    public void addCategories() {
        List<Category> categories=tmdbClient.getAllCategories().stream().
                map(CategoryMapper::mapToCategory).toList();
        categoryRepository.saveAll(categories);
    }

    public void addMovieToDb(Long movieId){
        if (movieRepository.existsById(movieId)) return;

        MovieDetailsApi movieDetailsApi=tmdbClient.getMovieDetails(movieId);
        String trailerKey = movieDetailsApi.getVideos()
                .getResults()
                .stream()
                .filter(v -> v.isOfficial()
                        && "trailer".equalsIgnoreCase(v.getType()))
                .map(VideoTeaser::getKey)
                .findFirst()
                .orElse(null);
        Movie movie= MovieMapper.mapToMovie(movieDetailsApi,trailerKey);
        List<Category> categories=categoryRepository.findAllById(movieDetailsApi.getGenres().stream()
                .map(CategoryApi::getId).toList());
        movie.setCategories(categories);
        movieRepository.save(movie);
    }

    public void addNowPlayingMovies(int p){
        List<Long> movieIds=tmdbClient.getNowPlaying(p);
        movieIds.forEach(this::addMovieToDb);
    }

}

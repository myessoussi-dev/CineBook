package com.youssef.cinebook.Service;

import com.youssef.cinebook.Component.TmdbClient;
import com.youssef.cinebook.DTO.CategoryApi;
import com.youssef.cinebook.DTO.MovieDetailsApi;
import com.youssef.cinebook.DTO.VideoTeaser;
import com.youssef.cinebook.Entity.Category;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Mapper.CategoryMapper;
import com.youssef.cinebook.Mapper.MovieMapper;
import com.youssef.cinebook.Repository.CategoryRepository;
import com.youssef.cinebook.Repository.MovieRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public Movie MovieMaker(Long movieId){
        //if (movieRepository.existsById(movieId)) return;

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
        return movie;
    }
    public void addMoviesById(List<Long> ids){
        List<Movie> movies=new ArrayList<>();
        for(Long id : ids){
            Movie movie=MovieMaker(id);
            movies.add(movie);
        }
        movieRepository.saveAll(movies);
    }
    public void addNowPlayingMovies(int p){
        List<Long> movieIds=tmdbClient.getNowPlaying(p);
        List<Movie> movies=new ArrayList<>();
        for(Long id : movieIds){
            Movie movie=MovieMaker(id);
            movie.setStatus(Movie.MovieStatus.AVAILABLE);
            movies.add(movie);
        }
        movieRepository.saveAll(movies);
    }
    /*public void addPopularMovies(int p){
        List<Long> movieIds=tmdbClient.getPopularMovies(p);
        movieIds.forEach(this::MovieMaker);
    }*/
    public void addUpcomingMovies(int p){
        List<Long> movieIds=tmdbClient.getUpcomingMovies(p);
        List<Movie> movies=new ArrayList<>();
        for(Long id : movieIds){
            Movie movie=MovieMaker(id);
            movie.setStatus(Movie.MovieStatus.COMING_SOON);
            movies.add(movie);
        }
        movieRepository.saveAll(movies);
    }

}

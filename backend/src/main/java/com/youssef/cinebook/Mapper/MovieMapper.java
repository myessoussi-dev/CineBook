package com.youssef.cinebook.Mapper;


import com.youssef.cinebook.DTO.MovieDetailsApi;
import com.youssef.cinebook.Entity.Movie;

public class MovieMapper {

    public static Movie mapToMovie(MovieDetailsApi movieApi){
        Movie movie=new Movie();
        movie.setId(movieApi.getId());
        movie.setOverview(movieApi.getOverview());
        movie.setBackdropPath(movieApi.getBackdropPath());
        movie.setTitle(movieApi.getTitle());
        movie.setPosterPath(movieApi.getPosterPath());
        movie.setReleaseDate(movieApi.getReleaseDate());
        return movie;
    }

}

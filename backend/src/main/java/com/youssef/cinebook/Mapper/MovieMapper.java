package com.youssef.cinebook.Mapper;

import DTO.MovieApi;
import Model.Movie;

public class MovieMapper {

    public static Movie mapToMovie(MovieApi movieApi){
        Movie movie=new Movie();
        movie.setId(movieApi.getId());
        movie.setOverview(movieApi.getOverview());
        movie.setBackdropPath(movieApi.getBackdropPath());
        movie.setGenreIds(movieApi.getGenreIds());
        movie.setTitle(movieApi.getTitle());
        movie.setPosterPath(movieApi.getPosterPath());
        movie.setReleaseDate(movieApi.getReleaseDate());
        return movie;
    }

}

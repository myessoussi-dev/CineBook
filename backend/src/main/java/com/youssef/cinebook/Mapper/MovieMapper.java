package com.youssef.cinebook.Mapper;


import com.youssef.cinebook.DTO.MovieDetailsApi;
import com.youssef.cinebook.Entity.Movie;

import java.time.LocalDate;

public class MovieMapper {

    public static Movie mapToMovie(MovieDetailsApi movieApi,String videoKey){
        Movie movie=new Movie();
        movie.setId(movieApi.getId());
        movie.setOverview(movieApi.getOverview());
        movie.setBackdropPath(movieApi.getBackdropPath());
        movie.setTitle(movieApi.getTitle());
        movie.setPosterPath(movieApi.getPosterPath());
        movie.setReleaseDate(LocalDate.parse(movieApi.getReleaseDate()));
        movie.setPopularity(movieApi.getPopularity());
        movie.setRuntime(movieApi.getRuntime());
        movie.setVoteAverage(movieApi.getVoteAverage());
        movie.setVoteCount(movieApi.getVoteCount());
        movie.setVideoKey(videoKey);

        return movie;
    }

}

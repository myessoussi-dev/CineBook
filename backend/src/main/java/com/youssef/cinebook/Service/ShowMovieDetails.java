package com.youssef.cinebook.Service;

import com.youssef.cinebook.Component.TmdbClient;
import com.youssef.cinebook.DTO.MovieDetailsApi;
import com.youssef.cinebook.DTO.VideoTeaser;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ShowMovieDetails {
    private final TmdbClient tmdbClient;

    public ShowMovieDetails(TmdbClient tmdbClient)  {
        this.tmdbClient = tmdbClient;
    }
    public void showMovies()throws IOException{
        Set<Long> movieIds=tmdbClient.getNowPlaying(1);
        for (Long id : movieIds){
            MovieDetailsApi movieDetailsApi=tmdbClient.getMovieDetails(id);

            VideoTeaser trailer = movieDetailsApi.getVideos().
                    getResults().stream()
                    .filter(v -> v.isOfficial() && "trailer".equalsIgnoreCase(v.getType()))
                    .findFirst()
                    .orElse(null);

            System.out.println(movieDetailsApi);
            System.out.println(trailer);
        }


    }
}

package com.youssef.cinebook.Component;

import com.youssef.cinebook.DTO.*;
import org.springframework.stereotype.Component;


import java.util.List;

import static com.youssef.cinebook.EnvConfig.API_KEY;

@Component
public class TmdbClient {

    private final ApiClient apiClient;

    public TmdbClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public List<Long> getNowPlaying(int page){
        String url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                "&region=US&page="+page;
        MovieApi movieApi = apiClient.fetchMoviesJson(url, MovieApi.class);
        return movieApi.getResults().stream().map(MovieIdDTO::getId).toList();
    }

    public List<VideoTeaser> getVideos(int movieId) {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + API_KEY;
        VideoApi videoApi = apiClient.fetchMoviesJson(url, VideoApi.class);
        return videoApi.getResults();
    }
    public List<CategoryApi> getAllCategories(){
        String url="https://api.themoviedb.org/3/genre/movie/list?api_key="+API_KEY;
        AllCategories allCategories=apiClient.fetchMoviesJson(url,AllCategories.class);
        return allCategories.getGenres();
    }
    public MovieDetailsApi getMovieDetails(Long movieId){
        String url="https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_KEY+"&append_to_response=videos";
        return apiClient.fetchMoviesJson(url,MovieDetailsApi.class);
    }
    public List<Long> getPopularMovies(int page){
        String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY +
                "&region=US&page="+page;
        MovieApi movieApi=apiClient.fetchMoviesJson(url,MovieApi.class);
        return movieApi.getResults().stream().map(MovieIdDTO::getId).toList();
    }
    public List<Long> getUpcomingMovies(int page){
        String url = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + API_KEY +
                "&region=US&page="+page;
        MovieApi movieApi=apiClient.fetchMoviesJson(url,MovieApi.class);
        return movieApi.getResults().stream().map(MovieIdDTO::getId).toList();
    }
}
package com.youssef.cinebook.Component;

import com.youssef.cinebook.DTO.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
public class TmdbClient {
    @Value("${API_KEY}")
    private String API_KEY;
    private final ApiClient apiClient;

    public TmdbClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }
    public Set<Long> getNowPlaying(int page){
        String url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                "&region=US&page="+page;
        MovieApi movieApi = apiClient.fetchMoviesJson(url, MovieApi.class);
        return movieApi.getResults().stream().map(MovieIdDTO::getId).collect(Collectors.toSet());
    }

    public Set<VideoTeaser> getVideos(int movieId) {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + API_KEY;
        VideoApi videoApi = apiClient.fetchMoviesJson(url, VideoApi.class);
        return new HashSet<>(videoApi.getResults());
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
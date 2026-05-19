package com.youssef.cinebook;

import Model.Category;

import com.youssef.cinebook.ApiClient;
import com.youssef.cinebook.DTO.*;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

import static com.youssef.cinebook.EnvConfig.API_KEY;

@Component
public class TmdbClient {

    private final ObjectMapper objectMapper;
    private final ApiClient apiClient;

    public TmdbClient(ObjectMapper objectMapper, ApiClient apiClient) {
        this.objectMapper = objectMapper;
        this.apiClient = apiClient;
    }

    public List<MovieApi> getNowPlaying(int page) throws IOException {
        String url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                "&page="+page;
        MovieResponse movieResponse = apiClient.fetchMoviesJson(url, MovieResponse.class);
        return movieResponse.getResults();
    }

    public List<VideoTeaser> getVideos(int movieId) throws IOException {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + API_KEY;
        VideoApi videoApi = apiClient.fetchMoviesJson(url, VideoApi.class);
        return videoApi.getResults();
    }
    public List<Category> getAllCategories() throws IOException{
        String url="https://api.themoviedb.org/3/genre/movie/list?api_key="+API_KEY;
        CategoryApi categoryApi=apiClient.fetchMoviesJson(url,CategoryApi.class);
        return categoryApi.getGenres();
    }
}
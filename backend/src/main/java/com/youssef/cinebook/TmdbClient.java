package com.youssef.cinebook;

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

    public List<Long> getNowPlaying(int page) throws IOException {
        String url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                "&page="+page;
        NowPlayingMovie movieResponse = apiClient.fetchMoviesJson(url, NowPlayingMovie.class);
        return movieResponse.getResults().stream().map(MovieIdDTO::getId).toList();
    }

    public List<VideoTeaser> getVideos(int movieId) throws IOException {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + API_KEY;
        VideoApi videoApi = apiClient.fetchMoviesJson(url, VideoApi.class);
        return videoApi.getResults();
    }
    public List<CategoryApi> getAllCategories() throws IOException{
        String url="https://api.themoviedb.org/3/genre/movie/list?api_key="+API_KEY;
        AllCategories allCategories=apiClient.fetchMoviesJson(url,AllCategories.class);
        return allCategories.getGenres();
    }
    public MovieDetailsApi getMovieDetails(Long movieId){
        String url="https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_KEY+"&append_to_response=videos";
        return apiClient.fetchMoviesJson(url,MovieDetailsApi.class);
    }
}
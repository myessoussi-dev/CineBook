package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoApi {
    private List<VideoTeaser> results;

    public VideoApi() {
    }
    @Override
    public String toString() {
        return "VideoApi{" +
                "results=" + results +
                '}';
    }

    public List<VideoTeaser> getResults() {
        return results;
    }

    public void setResults(List<VideoTeaser> results) {
        this.results = results;
    }
}

package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoApi {
    private int id;
    private List<VideoTeaser> results;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<VideoTeaser> getResults() {
        return results;
    }

    public void setResults(List<VideoTeaser> results) {
        this.results = results;
    }
}

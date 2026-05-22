package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieApi {

    private Map<String, Object> dates;
    private List<MovieIdDTO> results;

    public Map<String, Object> getDates() {
        return dates;
    }

    public void setDates(Map<String, Object> dates) {
        this.dates = dates;
    }

    public List<MovieIdDTO> getResults() {
        return results;
    }

    public void setResults(List<MovieIdDTO> results) {
        this.results = results;
    }

    public MovieApi() {
    }
}

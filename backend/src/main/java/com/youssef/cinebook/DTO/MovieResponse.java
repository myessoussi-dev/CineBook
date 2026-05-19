package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieResponse {

    private Map<String,Object> dates;
    private List<MovieApi> results;
    private int total_results;

    public Map<String, Object> getDates() {
        return dates;
    }

    public void setDates(Map<String, Object> dates) {
        this.dates = dates;
    }

    public List<MovieApi> getResults() {
        return results;
    }

    public void setResults(List<MovieApi> results) {
        this.results = results;
    }


    public int getTotal_results() {
        return total_results;
    }

    public void setTotal_results(int total_results) {
        this.total_results = total_results;
    }
}

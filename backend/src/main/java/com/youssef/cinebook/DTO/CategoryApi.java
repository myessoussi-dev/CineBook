package com.youssef.cinebook.DTO;

import Model.Category;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryApi {
    private List<Category> genres;

    public CategoryApi() {
    }


    public List<Category> getGenres() {
        return genres;
    }

    public void setGenres(List<Category> genres) {
        this.genres = genres;
    }
}

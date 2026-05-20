package com.youssef.cinebook.DTO;

import java.util.List;

public class AllCategories {
    private List<CategoryApi> genres;

    public List<CategoryApi> getGenres() {
        return genres;
    }

    public void setGenres(List<CategoryApi> genres) {
        this.genres = genres;
    }

    public AllCategories() {
    }
}

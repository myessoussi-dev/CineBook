package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.youssef.cinebook.Entity.Category;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryApi {
    private Long id;
    private String name;

    public CategoryApi() {
    }
    @Override
    public String toString() {
        return "CategoryApi{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

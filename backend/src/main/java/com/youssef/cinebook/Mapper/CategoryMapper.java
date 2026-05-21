package com.youssef.cinebook.Mapper;

import com.youssef.cinebook.DTO.CategoryApi;
import com.youssef.cinebook.Entity.Category;

public class CategoryMapper {
    public static Category mapToCategory(CategoryApi categoryApi){
        Category category=new Category();
        category.setId(categoryApi.getId());
        category.setName(categoryApi.getName());
        return category;
    }
}

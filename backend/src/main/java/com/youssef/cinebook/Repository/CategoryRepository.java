package com.youssef.cinebook.Repository;

import com.youssef.cinebook.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}

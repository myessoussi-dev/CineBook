package com.youssef.cinebook.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
public class Category implements Serializable {
    @Id
    private Long id;
    @Column(nullable = false)
    private String name;
}

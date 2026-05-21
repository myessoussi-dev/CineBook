package com.youssef.cinebook.Component;

import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {
    private final TmdbToBd tmdbToBd;

    public DataInitializer(TmdbToBd tmdbToBd) {
        this.tmdbToBd = tmdbToBd;
    }
}

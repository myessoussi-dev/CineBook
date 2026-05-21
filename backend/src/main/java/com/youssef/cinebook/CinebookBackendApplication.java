package com.youssef.cinebook;

import com.youssef.cinebook.Component.DataInitializer;
import com.youssef.cinebook.Service.ShowMovieDetails;
import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CinebookBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinebookBackendApplication.class, args);
	}
}

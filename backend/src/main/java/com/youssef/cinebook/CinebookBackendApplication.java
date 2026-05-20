package com.youssef.cinebook;

import com.youssef.cinebook.Service.ShowMovieDetails;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CinebookBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinebookBackendApplication.class, args);
	}
	@Bean
	CommandLineRunner run(ShowMovieDetails service) {

		return args -> {
			service.showMovies();
		};
	}
}

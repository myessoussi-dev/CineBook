package com.youssef.cinebook;

import com.youssef.cinebook.Component.DataInitializer;
import com.youssef.cinebook.Entity.Movie;
import com.youssef.cinebook.Repository.MovieRepository;
import com.youssef.cinebook.Service.SeatService;
import com.youssef.cinebook.Service.ShowMovieDetails;
import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.ArrayList;
import java.util.List;
@EnableAsync
@SpringBootApplication
public class CinebookBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinebookBackendApplication.class, args);
	}

	/*@Bean
	public CommandLineRunner fullDB(TmdbToBd service){
		return args -> {
			service.addUpcomingMovies(1);
			System.out.println("les film ont ete ajoute avec success !!!!");
		};
	}*/
	/*@Bean
	public CommandLineRunner fullseats(SeatService seatService) {
		return args -> {
			List<Long> ids = new ArrayList<>(List.of(1L, 2L, 3L, 4L));
			seatService.fullSeatTable(ids);
			System.out.println("les sieges sont ajoute avec success !!!");
		};
	}*/
	/*@Bean
	public CommandLineRunner getMoviesId(MovieRepository movieRepository){
		return args -> {
			List<Long> ids=movieRepository.findAll().stream().map(Movie::getId).toList();
			System.out.println(ids);
		};
	}*/
}


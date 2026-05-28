package com.youssef.cinebook.Component;

import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {
    private final TmdbToBd tmdbToBd;

    public DataInitializer(TmdbToBd tmdbToBd) {
        this.tmdbToBd = tmdbToBd;
    }
    /*@Bean
	public CommandLineRunner getGenres(TmdbToBd service){
		return args -> {
			service.addCategories();
			System.out.println("les Categories sont ajoute avec success !!!!");
		};
	}
	@Bean
	public CommandLineRunner upcomingMovies(TmdbToBd service){
		return args -> {
			service.addUpcomingMovies(1);
			System.out.println("les film avenir ont  ete ajoute avec success !!!!");
		};
	}
	@Bean
	public CommandLineRunner nowPlayingMovies(TmdbToBd service){
		return args -> {
			service.addNowPlayingMovies(1);
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
			List<Long> ids=movieRepository.findByStatus(Movie.MovieStatus.AVAILABLE).stream().map(Movie::getId).toList();
			System.out.println(ids);
		};
	}*/
	/*@Bean
	public CommandLineRunner addmovies(TmdbToBd service){
		return args -> {
			service.addMoviesById(List.of(1226863L,687163L));
			System.out.println("les film ont ete ajoute avec success !!!!");
		};
	}*/
}

package com.youssef.cinebook.Component;

import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Stream;

@Component
public class DataInitializer implements ApplicationRunner {

    private final TmdbToBd tmdbToBd;
    public DataInitializer(TmdbToBd tmdbToBd) {
        this.tmdbToBd = tmdbToBd;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (args.containsOption("init-all")) {
            System.out.println("Lancement de l'initialisation complète des données...");
            tmdbToBd.addCategories();
            tmdbToBd.addUpcomingMovies(1);
            tmdbToBd.addNowPlayingMovies(1);
            System.out.println("✅ Initialisation complète terminée !");
            return;
        }
        if (args.containsOption("init-categories")) {
            tmdbToBd.addCategories();
            System.out.println("Les catégories ont été ajoutées avec succès !");
        }

        if (args.containsOption("init-upcoming")) {
            tmdbToBd.addUpcomingMovies(1);
            System.out.println("Les films à venir ont été ajoutés avec succès !");
        }

        if (args.containsOption("init-now-playing")) {
            tmdbToBd.addNowPlayingMovies(1);
            System.out.println("Les films à l'affiche ont été ajoutés avec succès !");
        }

        if (args.containsOption("add-movies")) {
            List<String> movieIdsRaw = args.getOptionValues("add-movies");
            if (movieIdsRaw != null && !movieIdsRaw.isEmpty()) {
                List<Long> movieIds = Stream.of(movieIdsRaw.getFirst().split(","))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .toList();

                tmdbToBd.addMoviesById(movieIds);
                System.out.println("Les films spécifiques " + movieIds + " ont été ajoutés !");
            }
        }
    }
}
package com.youssef.cinebook.Component;

import com.youssef.cinebook.Entity.Room;
import com.youssef.cinebook.Repository.RoomRepository;
import com.youssef.cinebook.Service.SeatService;
import com.youssef.cinebook.Service.TmdbToBd;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Component
public class DataInitializer implements ApplicationRunner {

    private final TmdbToBd tmdbToBd;
    private final SeatService seatService;
    private final RoomRepository roomRepository;
    public DataInitializer(TmdbToBd tmdbToBd , SeatService seatService,
                           RoomRepository roomRepository) {
        this.tmdbToBd = tmdbToBd;
        this.seatService=seatService;
        this.roomRepository=roomRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {

        if (args.containsOption("init-all")) {
            System.out.println("Lancement de l'initialisation complète des données...");
            tmdbToBd.addCategories();
            //tmdbToBd.addUpcomingMovies(1);
            tmdbToBd.addNowPlayingMovies(1);
            if (roomRepository.count() == 0) {

                List<Room> rooms = new ArrayList<>();

                for (int i = 1; i <= 4; i++) {
                    Room r = new Room();
                    r.setCapacity(160);
                    r.setName("salle " + i);
                    rooms.add(r);
                }

                roomRepository.saveAll(rooms);
            }
            System.out.println("les salles sont ajoutees avec success");
            List<Long> ids = new ArrayList<>(List.of(1L, 2L, 3L, 4L));
            seatService.fullSeatTable(ids);
            System.out.println("les sieges sont ajoute avec success !!!");
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
            tmdbToBd.syncNowPlayingMovies();
            System.out.println("Les films à l'affiche ont été mis à jour avec succès !");
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
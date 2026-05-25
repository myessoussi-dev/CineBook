package com.youssef.cinebook.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
@Getter
@Setter
@Entity
public class Movie {
    public enum MovieStatus {
        AVAILABLE,
        COMING_SOON,
        ARCHIVED
    }
    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String overview;

    @Column(length = 500)
    private String posterPath;

    private LocalDate releaseDate;

    @Column(length = 100)
    private String videoKey;

    @Column(length = 500)
    private String backdropPath;

    private Integer runtime;
    private Double voteAverage;
    private Integer voteCount;
    private Double popularity;
    @ManyToMany
    // Remarque : joinColumns est un tableau car il peut contenir plusieurs colonnes
    // dans le cas où la clé primaire de l’entité référencée est composite (plusieurs champs).
    // Dans le cas normal, une seule colonne suffit (clé simple).
    @JoinTable(name = "movie_categorie",
            joinColumns = @JoinColumn(name = "movie_id"),//entity actuel
            inverseJoinColumns = @JoinColumn(name = "category_id")// ca veut dire l autre entity
            // cote
    )

    private List<Category> categories;
    @Column(nullable = true,
            columnDefinition = "VARCHAR(20) CHECK (status IN ('AVAILABLE','COMING_SOON','ARCHIVED'))")
    @Enumerated(EnumType.STRING)
    private MovieStatus status;
}
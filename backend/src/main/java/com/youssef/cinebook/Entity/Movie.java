package com.youssef.cinebook.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class Movie {
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

    public Integer getRuntime() {
        return runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

    public Double getVoteAverage() {
        return voteAverage;
    }

    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }

    public Integer getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(Integer voteCount) {
        this.voteCount = voteCount;
    }

    public Double getPopularity() {
        return popularity;
    }

    public void setPopularity(Double popularity) {
        this.popularity = popularity;
    }

    @ManyToMany
    // Remarque : joinColumns est un tableau car il peut contenir plusieurs colonnes
    // dans le cas où la clé primaire de l’entité référencée est composite (plusieurs champs).
    // Dans le cas normal, une seule colonne suffit (clé simple).
    @JoinTable(name = "movie_categorie",
            joinColumns = @JoinColumn(name ="movie_id"),//entity actuel
    inverseJoinColumns = @JoinColumn(name="category_id")// ca veut dire l autre entity
            // cote
    )
    private List<Category> categories;


    @Override
    public String toString() {
        return "\n================ MOVIE ================\n" +
                "ID           : " + id + "\n" +
                "Title        : " + title + "\n" +
                "Release Date : " + releaseDate + "\n" +
                "Overview     : " + overview + "\n" +
                "Poster Path  : " + posterPath + "\n" +
                "Backdrop Path: " + backdropPath + "\n" +
                "Video Key    : " + videoKey + "\n" +
                "=======================================\n";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getVideoKey() {
        return videoKey;
    }

    public void setVideoKey(String videoKey) {
        this.videoKey = videoKey;
    }

    public String getBackdropPath() {
        return backdropPath;
    }

    public void setBackdropPath(String backdropPath) {
        this.backdropPath = backdropPath;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}

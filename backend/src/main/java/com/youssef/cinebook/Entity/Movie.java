package com.youssef.cinebook.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Movie {
    @Id
    private Integer id;
    private String title;
    private String overview;
    private String posterPath;
    private String releaseDate;
    private String VideoKey;
    private String backdropPath;

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
                "Video Key    : " + VideoKey + "\n" +
                "=======================================\n";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getVideoKey() {
        return VideoKey;
    }

    public void setVideoKey(String videoKey) {
        VideoKey = videoKey;
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

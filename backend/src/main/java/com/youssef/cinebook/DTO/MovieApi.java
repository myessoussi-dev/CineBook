package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // Sécurité au cas où l'API ajouterait d'autres champs plus tard
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class) // Gère la traduction snake_case -> camelCase automatiquement
public class MovieApi {
    private boolean adult;
    private String backdropPath;
    private List<Integer> genreIds; // Tableau d'entiers [16, 35, 10751]
    private int id;
    private String title;
    private String originalLanguage;
    private String originalTitle;
    private String overview;
    private double popularity;
    private String posterPath;
    private String releaseDate; // Tu peux utiliser String ou LocalDate si tu gères les dates
    private boolean softcore;
    private boolean video;
    private double voteAverage;
    private int voteCount;

    // 💡 Le constructeur vide par défaut indispensable pour Jackson
    public MovieApi() {
    }

    // --- GETTERS ET SETTERS ---
    @Override
    public String toString() {
        return "--------------------------------------------------\n" +
                "🎬 FILM : " + title + " (" + originalTitle + ")\n" +
                "📅 Sortie : " + releaseDate + " | ⭐ Note : " + voteAverage + "/10 (" + voteCount + " votes)\n" +
                "📝 Résumé : " + overview + "\n" +
                "--------------------------------------------------";
    }

    public boolean isAdult() { return adult; }
    public void setAdult(boolean adult) { this.adult = adult; }

    public String getBackdropPath() { return backdropPath; }
    public void setBackdropPath(String backdropPath) { this.backdropPath = backdropPath; }

    public List<Integer> getGenreIds() { return genreIds; }
    public void setGenreIds(List<Integer> genreIds) { this.genreIds = genreIds; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public double getPopularity() { return popularity; }
    public void setPopularity(double popularity) { this.popularity = popularity; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public boolean isSoftcore() { return softcore; }
    public void setSoftcore(boolean softcore) { this.softcore = softcore; }

    public boolean isVideo() { return video; }
    public void setVideo(boolean video) { this.video = video; }

    public double getVoteAverage() { return voteAverage; }
    public void setVoteAverage(double voteAverage) { this.voteAverage = voteAverage; }

    public int getVoteCount() { return voteCount; }
    public void setVoteCount(int voteCount) { this.voteCount = voteCount; }
}
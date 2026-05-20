package com.youssef.cinebook.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // Sécurité au cas où l'API ajouterait d'autres champs plus tard
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class) // Gère la traduction snake_case -> camelCase automatiquement
public class MovieDetailsApi {

    private Long id;
    private String title;
    private List<CategoryApi> genres;
    private String overview;
    private String posterPath;
    private String backdropPath;
    private String releaseDate;
    private Integer runtime;
    private Double voteAverage;
    private Integer voteCount;
    private Double popularity;
    private VideoApi videos;


    //Le constructeur vide par défaut indispensable pour Jackson
    public MovieDetailsApi() {
    }

    // --- GETTERS ET SETTERS ---
    @Override
    public String toString() {
        return "MovieApi {\n" +
                "  id=" + id + "\n" +
                "  title='" + title + '\'' + "\n" +
                "  releaseDate='" + releaseDate + '\'' + "\n" +
                "  runtime=" + runtime + " min\n" +
                "  voteAverage=" + voteAverage + " ⭐\n" +
                "  voteCount=" + voteCount + "\n" +
                "  popularity=" + popularity + "\n" +
                "  genres=" + genres + "\n" +
                "  posterPath='" + posterPath + '\'' + "\n" +
                "  backdropPath='" + backdropPath + '\'' + "\n" +
                "  overview='" + (overview != null ? overview.substring(0, Math.min(80, overview.length())) + "..." : null) + '\'' + "\n" +
                '}';
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

    public List<CategoryApi> getGenres() {
        return genres;
    }

    public void setGenres(List<CategoryApi> genres) {
        this.genres = genres;
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

    public String getBackdropPath() {
        return backdropPath;
    }

    public void setBackdropPath(String backdropPath) {
        this.backdropPath = backdropPath;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

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

    public VideoApi getVideos() {
        return videos;
    }

    public void setVideos(VideoApi videos) {
        this.videos = videos;
    }
}
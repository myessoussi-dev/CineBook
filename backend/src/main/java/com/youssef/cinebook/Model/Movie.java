package Model;

import java.util.List;

public class Movie {
    private String backdropPath;
    private List<Integer> genreIds;
    private int id;
    private String title;
    private String overview;
    private String posterPath;
    private String releaseDate;
    private String VideoKey;

    public Movie(){}

    public String getBackdropPath() {
        return backdropPath;
    }
    @Override
    public String toString() {
        return "\n================ MOVIE ================\n" +
                "ID           : " + id + "\n" +
                "Title        : " + title + "\n" +
                "Release Date : " + releaseDate + "\n" +
                "Genres       : " + genreIds + "\n" +
                "Overview     : " + overview + "\n" +
                "Poster Path  : " + posterPath + "\n" +
                "Backdrop Path: " + backdropPath + "\n" +
                "Video Key    : " + VideoKey + "\n" +
                "=======================================\n";
    }
    public void setBackdropPath(String backdropPath) {
        this.backdropPath = backdropPath;
    }

    public List<Integer> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(List<Integer> genreIds) {
        this.genreIds = genreIds;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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
        this.VideoKey = videoKey;
    }
}

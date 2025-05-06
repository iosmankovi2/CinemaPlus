package com.example.cinemaplus.movie.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private int durationInMinutes;

    private String genre;

    private String director;

<<<<<<< HEAD
    private String movie_cast;
=======
    private String movieCast;
>>>>>>> 0a18f5ed2332883b8fb5c0dc204efd6cd50d7a8c

    private int releaseYear;

    private boolean currentlyShowing;
    
    private String trailerUrl;
    
    private String imageUrl;


    // Getteri i setteri

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(int durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

<<<<<<< HEAD
    public String getMovieCast() {
        return movie_cast;
    }

    public void setMovieCast(String movie_cast) {
        this.movie_cast = movie_cast;
=======
    public String getCast() {
        return movieCast;
    }

    public void setCast(String cast) {
        this.movieCast = cast;
>>>>>>> 0a18f5ed2332883b8fb5c0dc204efd6cd50d7a8c
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public boolean isCurrentlyShowing() {
        return currentlyShowing;
    }

    public void setCurrentlyShowing(boolean currentlyShowing) {
        this.currentlyShowing = currentlyShowing;
    }
<<<<<<< HEAD
}
=======

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

>>>>>>> 0a18f5ed2332883b8fb5c0dc204efd6cd50d7a8c

package com.example.cinemaplus.movie.model;

import com.example.cinemaplus.review.model.Review;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
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

    private String movieCast;

    private int releaseYear;

    private boolean currentlyShowing;

    private String trailerUrl;

    private String imageUrl;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews;

    public Movie(String title, String description, int durationInMinutes, String genre,
                 String director, String movieCast, int releaseYear, boolean currentlyShowing,
                 String trailerUrl, String imageUrl) {
        this.title = title;
        this.description = description;
        this.durationInMinutes = durationInMinutes;
        this.genre = genre;
        this.director = director;
        this.movieCast = movieCast;
        this.releaseYear = releaseYear;
        this.currentlyShowing = currentlyShowing;
        this.trailerUrl = trailerUrl;
        this.imageUrl = imageUrl;
    }
}

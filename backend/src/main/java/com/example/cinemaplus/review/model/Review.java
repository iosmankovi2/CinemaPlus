package com.example.cinemaplus.review.model;

import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.movie.model.Movie; 

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Review{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private int rating;

    private LocalDateTime createdAt = LocalDateTime.now();

    public int getRating() {
    return this.rating;
}


}

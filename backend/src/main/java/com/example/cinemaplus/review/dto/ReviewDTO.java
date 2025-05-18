package com.example.cinemaplus.review.dto;

import java.time.LocalDateTime;

import com.example.cinemaplus.review.model.Review;

import lombok.Getter;
@Getter
public class ReviewDTO{
    private Long id;
    private String comment;
    private int rating;
    private LocalDateTime createdAt;
    private String userName;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.comment = review.getComment();
        this.rating = review.getRating();
        this.createdAt = review.getCreatedAt();
        this.userName = review.getUser().getFirstName();
    }
}

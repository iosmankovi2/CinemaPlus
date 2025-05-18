package com.example.cinemaplus.review.controller;

import com.example.cinemaplus.review.dto.ReviewDTO;
import com.example.cinemaplus.review.model.Review;
import com.example.cinemaplus.review.repository.ReviewRepository;
import com.example.cinemaplus.movie.repository.MovieRepository;
import com.example.cinemaplus.user.repository.UserRepository;
import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.cinemaplus.security.CustomUserDetails;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private UserRepository userRepository;


        @PreAuthorize("hasRole('User') or hasRole('Admin')")
        @PostMapping
        public ResponseEntity<?> addReview(
        @RequestBody Review review,
        @AuthenticationPrincipal CustomUserDetails principal) {

        if (review.getRating() < 1 || review.getRating() > 5) {
        return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
         }

        Movie movie = movieRepository.findById(review.getMovie().getId())
            .orElseThrow(() -> new RuntimeException("Movie not found"));

          User user = principal.getUser(); 

            review.setUser(user);
            review.setMovie(movie);

      Review saved = reviewRepository.save(review);
      ReviewDTO dto = new ReviewDTO(saved);
      return ResponseEntity.ok(dto);
}

    
   @GetMapping("/movie/{movieId}")
public List<ReviewDTO> getReviewsByMovie(@PathVariable Long movieId) {
    return reviewRepository.findByMovieId(movieId)
        .stream()
        .map(ReviewDTO::new)
        .toList();
}


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Review deleted");
    }
}

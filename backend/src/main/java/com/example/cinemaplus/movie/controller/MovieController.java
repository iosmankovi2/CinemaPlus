package com.example.cinemaplus.movie.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.service.MovieService;

import java.util.Optional;

import com.example.cinemaplus.movie.repository.MovieRepository;
@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    /*@GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
     return movieService.getMovieById(id).orElse(null);

     */

       @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        Optional<Movie> movieOptional = movieService.getMovieById(id);
        if (movieOptional.isPresent()) {
            return ResponseEntity.ok(movieOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/active-count")
    public Long countAllMovies() {
        return (long) movieService.getAllMovies().size();
    }

    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        Movie savedMovie = movieService.saveMovie(movie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Optional<Movie> existing = movieService.getMovieById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        updatedMovie.setId(id);
        Movie saved = movieService.saveMovie(updatedMovie);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        boolean deleted = movieService.deleteMovieById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    
}
}


package com.example.cinemaplus.movie.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id);
    }
    
}

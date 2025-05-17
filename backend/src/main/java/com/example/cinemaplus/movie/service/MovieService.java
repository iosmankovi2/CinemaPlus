package com.example.cinemaplus.movie.service;
import java.util.List;
import java.util.Optional;

import com.example.cinemaplus.projection.repository.ProjectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ProjectionRepository projectionRepository;

    public MovieService(MovieRepository movieRepository, ProjectionRepository projectionRepository) {
        this.movieRepository = movieRepository;
        this.projectionRepository = projectionRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }


    @Transactional
    public boolean deleteMovieById(Long id) {
        return getMovieById(id).map(movie -> {
            projectionRepository.deleteByMovieId(id);
            movieRepository.deleteById(id);
            return true;
        }).orElse(false);
    }




}
package com.example.cinemaplus.movie.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.cinemaplus.movie.model.Movie;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
public class MovieRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public List<Movie> findAll() {
        return entityManager.createQuery("SELECT m FROM Movie m", Movie.class)
                            .getResultList();
    }

    public Movie findById(long id) {
        return entityManager.find(Movie.class, id);
    }
    
}

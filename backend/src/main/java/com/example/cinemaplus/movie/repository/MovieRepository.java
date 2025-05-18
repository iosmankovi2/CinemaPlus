package com.example.cinemaplus.movie.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.cinemaplus.movie.model.Movie;
import org.springframework.stereotype.Repository;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {


    
}

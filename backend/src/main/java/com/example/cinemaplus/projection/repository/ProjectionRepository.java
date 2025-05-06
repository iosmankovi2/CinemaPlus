package com.example.cinemaplus.projection.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cinemaplus.projection.model.Projection;

@Repository
public interface ProjectionRepository extends JpaRepository<Projection, Long> {

    List<Projection> findByMovieIdAndStartTimeBetween(Long movieId, LocalDateTime start, LocalDateTime end);

}

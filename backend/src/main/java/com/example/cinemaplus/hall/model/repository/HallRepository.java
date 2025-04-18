package com.example.cinemaplus.hall.model.repository;

import com.example.cinemaplus.hall.model.model.Hall;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallRepository extends JpaRepository<Hall, Long> {
}
package com.example.cinemaplus.hall.hall.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cinemaplus.hall.hall.model.Hall;

public interface HallRepository extends JpaRepository<Hall, Long> {
}
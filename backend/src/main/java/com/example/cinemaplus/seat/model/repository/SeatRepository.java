package com.example.cinemaplus.seat.model.repository;

import com.example.cinemaplus.hall.model.Hall;
import com.example.cinemaplus.seat.model.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    long countByHallAndTakenFalse(Hall hall);
    List<Seat> findByHall(Hall hall);
}
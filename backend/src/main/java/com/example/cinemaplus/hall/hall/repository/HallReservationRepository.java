package com.example.cinemaplus.hall.hall.repository;

import com.example.cinemaplus.hall.hall.model.HallReservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallReservationRepository extends JpaRepository<HallReservation, Long> {
}
package com.example.cinemaplus.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cinemaplus.reservation.model.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}

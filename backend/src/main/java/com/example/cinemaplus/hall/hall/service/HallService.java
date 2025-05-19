package com.example.cinemaplus.hall.hall.service;

import com.example.cinemaplus.hall.hall.dto.HallDTO;
import com.example.cinemaplus.hall.hall.model.Hall;
import com.example.cinemaplus.hall.hall.repository.HallRepository;
import com.example.cinemaplus.hall.hall.model.HallReservation; // Pretpostavljeni entitet za rezervaciju sale
import com.example.cinemaplus.hall.hall.repository.HallReservationRepository; // Pretpostavljeni repozitorij
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import com.example.cinemaplus.user.model.User; // Pretpostavljeni User entitet
import com.example.cinemaplus.user.repository.UserRepository; // Pretpostavljeni User repozitorij
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallService {

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository; // Potreban za dohvat korisnika

    @Autowired
    private HallReservationRepository hallReservationRepository; // Potreban za spremanje rezervacije sale

    public List<HallDTO> getAllHalls() {
        return hallRepository.findAll()
                .stream()
                .map(hall -> {
                    HallDTO dto = new HallDTO();
                    dto.setId(hall.getId());
                    dto.setName(hall.getName());
                    dto.setTotalSeats(hall.getNumberOfRows() * hall.getSeatsPerRow());
                    long available = seatRepository.countByHallAndTakenFalse(hall);
                    dto.setAvailableSeats((int) available);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public boolean reserveHall(Long hallId, Long userId, List<Long> seatIds) {
        Hall hall = hallRepository.findById(hallId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (hall == null || user == null) {
            System.out.println("Hall or user not found.");
            return false;
        }

        // Ovdje bi trebala doći složenija logika za provjeru dostupnosti dvorane
        // za određeni vremenski period ako to podržavaš.
        // Za sada, pretpostavljamo da je dvorana dostupna za rezervaciju.

        HallReservation reservation = new HallReservation();
        reservation.setHall(hall);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDateTime.now());
        // Možda ćeš htjeti dodati i listu rezerviranih sjedala ako podržavaš
        // rezervaciju specifičnih sjedala unutar sale za zakup.
        // reservation.setReservedSeats(seatRepository.findAllById(seatIds));

        try {
            hallReservationRepository.save(reservation);
            System.out.println("Hall " + hallId + " reserved successfully for user " + userId);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving hall reservation: " + e.getMessage());
            return false;
        }
    }
}
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
    private UserRepository userRepository;

    @Autowired
    private HallReservationRepository hallReservationRepository;

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

    public boolean reserveHall(Long hallId, Long userId, List<Long> seatIds, LocalDateTime startTime, LocalDateTime endTime) {
        Hall hall = hallRepository.findById(hallId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (hall == null || user == null) {
            System.out.println("Hall or user not found.");
            return false;
        }

        // Ovdje dolazi logika za provjeru da li je dvorana slobodna u zadanom periodu
        // Ovo može uključivati pretragu postojećih rezervacija koje se preklapaju.
        // Za sada, preskačemo tu provjeru radi jednostavnosti.

        HallReservation reservation = new HallReservation();
        reservation.setHall(hall);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
      
        try {
            hallReservationRepository.save(reservation);
            System.out.println("Hall " + hallId + " reserved successfully for user " + userId +
                               ", from " + startTime + " to " + endTime);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving hall reservation: " + e.getMessage());
            return false;
        }
    }

    public boolean reserveHall(Long hallId, Long userId, List<Long> seatIds) {
        
        throw new UnsupportedOperationException("Reservation time must be specified for hall rental.");
    }
}
package com.example.cinemaplus.seat.model.controller;

import com.example.cinemaplus.seat.model.dto.SeatDTO;
import com.example.cinemaplus.seat.model.dto.SeatReservationRequest;
import com.example.cinemaplus.seat.model.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/hall/{hallId}")
    public ResponseEntity<List<SeatDTO>> getSeatsByHall(@PathVariable Long hallId) {
        List<SeatDTO> seats = seatService.getSeatsForHall(hallId);
        if (seats.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveSeats(@RequestBody SeatReservationRequest request) {
        boolean success = seatService.reserveSeats(request.getSeatIds());
        if (success) {
            return ResponseEntity.ok("Seats reserved successfully.");
        } else {
            return ResponseEntity.badRequest().body("Some seats are already taken.");
        }
    }
}
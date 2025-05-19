package com.example.cinemaplus.hall.hall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cinemaplus.hall.hall.dto.HallDTO;
import com.example.cinemaplus.hall.hall.dto.HallReservationRequest;
import com.example.cinemaplus.hall.hall.service.HallService;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
public class HallController {

    @Autowired
    private HallService hallService;

    @GetMapping
    public List<HallDTO> getAllHalls() {
        return hallService.getAllHalls();
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveHall(@RequestBody HallReservationRequest request) {
        boolean success = hallService.reserveHall(request.getHallId(), request.getUserId(), request.getSeatIds());
        if (success) {
            return ResponseEntity.ok("Hall reserved successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to reserve hall.");
        }
    }
}
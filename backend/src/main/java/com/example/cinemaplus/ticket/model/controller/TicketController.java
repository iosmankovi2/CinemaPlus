package com.example.cinemaplus.ticket.model.controller;

import com.example.cinemaplus.ticket.model.dto.TicketRequestDTO;
import com.example.cinemaplus.ticket.model.dto.TicketDTO;
import com.example.cinemaplus.ticket.model.servce.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<?> createTickets(@RequestBody TicketRequestDTO request) {
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            return ResponseEntity.badRequest().body("No seats selected.");
        }
        if (request.getProjectionId() == null || request.getUserId() == null) {
            return ResponseEntity.badRequest().body("Missing projectionId or userId.");
        }

        try {
            ticketService.createTickets(request);
            return ResponseEntity.ok("Tickets created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsByUser(@PathVariable Long userId) {
        List<TicketDTO> tickets = ticketService.getTicketsByUser(userId);
        return ResponseEntity.ok(tickets);
    }

    // Optional: default GET just to confirm endpoint exists
    @GetMapping
    public String test() {
        return "Tickets endpoint is working.";
    }
}

package com.example.cinemaplus.ticket.model.controller;

import com.example.cinemaplus.ticket.model.dto.TicketRequestDTO;
import com.example.cinemaplus.ticket.model.dto.TicketDTO;
import com.example.cinemaplus.ticket.model.model.Ticket;
import com.example.cinemaplus.ticket.model.servce.TicketEmailService;
import com.example.cinemaplus.ticket.model.servce.TicketPdfService;
import com.example.cinemaplus.ticket.model.servce.TicketService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketPdfService pdfService;

    @Autowired
    private TicketEmailService emailService;

    @PostMapping
    public ResponseEntity<?> createTickets(@RequestBody TicketRequestDTO request) {
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            return ResponseEntity.badRequest().body("No seats selected.");
        }

        if (request.getProjectionId() == null || request.getUserId() == null) {
            return ResponseEntity.badRequest().body("Missing projectionId or userId.");
        }

        try {
            Long reservationId = ticketService.createTickets(request);
            if (reservationId == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Ticket creation failed, reservationId is null.");
            }

            return ResponseEntity.ok(reservationId.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating tickets: " + e.getMessage());
        }
    }

    @GetMapping("/pdf/{reservationId}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long reservationId) {
        try {
            byte[] pdfBytes = pdfService.generatePdfForReservation(reservationId);
            if (pdfBytes == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename("ticket.pdf").build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/email/{reservationId}")
    public ResponseEntity<String> emailTicket(@PathVariable Long reservationId, @RequestParam String email) {
        List<Ticket> tickets = ticketService.getTicketsByReservationId(reservationId);
        if (tickets == null || tickets.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tickets found.");
        }

        byte[] pdf = pdfService.generatePdfForTickets(tickets);
        if (pdf == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate PDF.");
        }

        try {
            emailService.sendTicketEmail(email, pdf);
            return ResponseEntity.ok("Email sent.");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsByUser(@PathVariable Long userId) {
        List<TicketDTO> tickets = ticketService.getTicketsByUser(userId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping
    public String test() {
        return "Tickets endpoint is working.";
    }
}

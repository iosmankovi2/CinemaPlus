package com.example.cinemaplus.ticket.model.servce;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.repository.ProjectionRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import com.example.cinemaplus.ticket.model.TicketStatus;
import com.example.cinemaplus.ticket.model.TicketType;
import com.example.cinemaplus.ticket.model.dto.TicketDTO;
import com.example.cinemaplus.ticket.model.dto.TicketRequestDTO;
import com.example.cinemaplus.ticket.model.model.Ticket;
import com.example.cinemaplus.ticket.model.repository.TicketRepository;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ProjectionRepository projectionRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketPdfService ticketPdfService;

    @Autowired
    private TicketEmailService ticketEmailService;

    public List<TicketDTO> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserId(userId).stream().map(this::mapToDTO).toList();
    }

    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setMovieTitle(ticket.getMovieTitle());
        dto.setDate(ticket.getDate().toString());
        dto.setTime(ticket.getTime().toString());
        dto.setHallName(ticket.getHallName());
        dto.setSeats(ticket.getSeats());
        dto.setPrice(ticket.getPrice().toString());
        dto.setPurchasedAt(ticket.getPurchaseDate().toString());
        return dto;
    }

    public void handleTicketDelivery(Ticket ticket) {
        if (ticket.getType() == TicketType.E_TICKET) {
            generatePdf(ticket);
        } else if (ticket.getType() == TicketType.EMAIL_TICKET) {
            sendEmailWithTicket(ticket);
        } else {
            System.out.println("Korisnik će preuzeti kartu lično.");
        }
    }

    private void sendEmailWithTicket(Ticket ticket) {
        System.out.println("Slanje e-maila korisniku za kartu: " + ticket.getId());
    }

    private void generatePdf(Ticket ticket) {
        System.out.println("Generisanje PDF karte za: " + ticket.getId());
    }

    public List<Ticket> getTicketsByReservationId(Long reservationId) {
        return ticketRepository.findAllByReservationId(reservationId);
    }

    public Long createTickets(TicketRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Projection projection = projectionRepository.findById(request.getProjectionId())
                .orElseThrow(() -> new RuntimeException("Projection not found"));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        Long reservationId = System.currentTimeMillis();

        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setUser(user);
            ticket.setProjection(projection);
            ticket.setSeat(seat);
            ticket.setType(TicketType.valueOf(request.getType()));
            ticket.setPrice(projection.getTicketPrice());
            ticket.setPurchaseDate(LocalDateTime.now());
            ticket.setReservationId(reservationId);
            ticket.setStatus(TicketStatus.valueOf("ACTIVE"));

            seat.setTaken(true);
            seatRepository.save(seat);

            ticketRepository.save(ticket);
        }

        if (TicketType.valueOf(request.getType()) == TicketType.EMAIL_TICKET) {
            try {
                List<Ticket> tickets = ticketRepository.findAllByReservationId(reservationId);
                byte[] pdfData = ticketPdfService.generatePdfForTickets(tickets);
                ticketEmailService.sendTicketEmail(user.getEmail(), pdfData);
            } catch (MessagingException e) {
                System.err.println("Slanje e-maila nije uspjelo: " + e.getMessage());
            }
        }

        return reservationId;
    }
}

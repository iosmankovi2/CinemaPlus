package com.example.cinemaplus.ticket.model.servce;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.repository.ProjectionRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import com.example.cinemaplus.ticket.model.TicketType;
import com.example.cinemaplus.ticket.model.dto.TicketDTO;
import com.example.cinemaplus.ticket.model.dto.TicketRequestDTO;
import com.example.cinemaplus.ticket.model.model.Ticket;
import com.example.cinemaplus.ticket.model.repository.TicketRepository;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;
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
        dto.setPurchasedAt(ticket.getPurchasedAt().toString());
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

    public void createTickets(TicketRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Projection projection = projectionRepository.findById(request.getProjectionId())
                .orElseThrow(() -> new RuntimeException("Projection not found"));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setUser(user);
            ticket.setProjection(projection);
            ticket.setSeat(seat);
            ticket.setType(TicketType.valueOf(request.getType()));
            ticket.setPrice(projection.getTicketPrice());
            ticket.setPurchaseDate(LocalDateTime.now());

            ticketRepository.save(ticket);
            handleTicketDelivery(ticket);
        }
    }
}

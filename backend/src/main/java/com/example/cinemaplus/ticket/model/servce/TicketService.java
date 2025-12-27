package com.example.cinemaplus.ticket.model.servce;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.repository.ProjectionRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import com.example.cinemaplus.security.CustomUserDetails;
import com.example.cinemaplus.ticket.model.TicketStatus;
import com.example.cinemaplus.ticket.model.TicketType;
import com.example.cinemaplus.ticket.model.dto.LatestTicketDTO;
import com.example.cinemaplus.ticket.model.dto.TicketDTO;
import com.example.cinemaplus.ticket.model.dto.TicketRequestDTO;
import com.example.cinemaplus.ticket.model.model.Ticket;
import com.example.cinemaplus.ticket.model.repository.TicketRepository;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public List<LatestTicketDTO> findLatestTickets(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "purchaseDate"));
        List<Ticket> tickets = ticketRepository.findAll(pageable).getContent();
        return tickets.stream().map(this::mapToLatestDTO).toList();
    }

    private LatestTicketDTO mapToLatestDTO(Ticket ticket) {
        LatestTicketDTO dto = new LatestTicketDTO();
        dto.setMovieTitle(ticket.getMovieTitle());
        dto.setPrice(ticket.getPrice().toString());
        dto.setUserName(ticket.getUser().getFirstName() + " " + ticket.getUser().getLastName());
        return dto;
    }

    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setReservationId(ticket.getReservationId()); // ✅ NEW
        dto.setMovieTitle(ticket.getMovieTitle());
        dto.setDate(ticket.getDate().toString());
        dto.setTime(ticket.getTime().toString());
        dto.setHallName(ticket.getHallName());
        dto.setSeats(ticket.getSeats());
        dto.setPrice(ticket.getPrice().toString());
        dto.setPurchasedAt(ticket.getPurchaseDate().toString());
        dto.setUserName(ticket.getUser().getFirstName() + " " + ticket.getUser().getLastName());
        dto.setStatus(ticket.getStatus() != null ? ticket.getStatus().name() : null); // ✅ NEW
        dto.setType(ticket.getType()); // opcionalno
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

            // ✅ default ACTIVE
            ticket.setStatus(TicketStatus.ACTIVE);

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

    @Transactional
public void cancelReservation(Long reservationId, Long targetUserId, CustomUserDetails principal) {

    List<Ticket> tickets = ticketRepository.findAllByReservationId(reservationId);

    if (tickets == null || tickets.isEmpty()) {
        throw new IllegalArgumentException("No tickets found for reservationId: " + reservationId);
    }

    boolean isAdmin = principal.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(a -> a.equals("ROLE_ADMIN"));

    Long principalUserId = principal.getUser().getId();
    Long reservationOwnerId = tickets.get(0).getUser().getId();

    boolean sameOwner = tickets.stream()
            .allMatch(t -> t.getUser() != null && t.getUser().getId().equals(reservationOwnerId));

    if (!sameOwner) {
        throw new IllegalArgumentException("Invalid reservation data: tickets have different owners.");
    }

    if (isAdmin) {
        if (targetUserId != null && !reservationOwnerId.equals(targetUserId)) {
            throw new IllegalArgumentException("Reservation does not belong to provided userId.");
        }
    } else {
        if (!reservationOwnerId.equals(principalUserId)) {
            throw new IllegalArgumentException("You are not allowed to cancel this reservation.");
        }
    }

    boolean allCancelled = tickets.stream().allMatch(t -> t.getStatus() == TicketStatus.CANCELLED);
    if (allCancelled) {
        throw new IllegalArgumentException("Reservation is already cancelled.");
    }

    // update tickets + free seats
    for (Ticket ticket : tickets) {
        ticket.setStatus(TicketStatus.CANCELLED);

        Seat seat = ticket.getSeat();
        if (seat != null) {
            seat.setTaken(false);
        }
    }

    // batch save (less DB calls)
    ticketRepository.saveAll(tickets);

    // batch save seats too (optional but cleaner)
    List<Seat> seatsToSave = tickets.stream()
            .map(Ticket::getSeat)
            .filter(s -> s != null)
            .toList();
    seatRepository.saveAll(seatsToSave);
}

}

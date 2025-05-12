package com.example.cinemaplus.ticket.model.model;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.ticket.model.TicketStatus;
import com.example.cinemaplus.ticket.model.TicketType;
import com.example.cinemaplus.user.model.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "projection_id")
    private Projection projection;

    @ManyToOne(optional = false)
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketType type;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private LocalDateTime purchaseDate;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    // === VIRTUALNA POLJA (izračunata iz povezanih entiteta) ===

    public String getMovieTitle() {
        return projection.getMovie().getTitle();
    }

    public String getHallName() {
        return projection.getHall().getName();
    }

    public List<String> getSeats() {
        return List.of(seat.getLabel());
    }

    public LocalDate getDate() {
        return projection.getStartTime().toLocalDate();
    }

    public LocalTime getTime() {
        return projection.getStartTime().toLocalTime();
    }

    public LocalDateTime getPurchasedAt() {
        return purchaseDate;
    }
}

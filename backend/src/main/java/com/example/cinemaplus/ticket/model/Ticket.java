package com.example.cinemaplus.ticket.model;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.seat.model.Seat;
import com.example.cinemaplus.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Povezivanje s korisnikom

    @ManyToOne
    @JoinColumn(name = "projection_id", nullable = false)
    private Projection projection; // Povezivanje s projekcijom

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat; // Povezivanje sa sjedištem

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketType type; // Tip karte (e-karta, fizička)

    @Column(nullable = false)
    private Double price; // Cijena karte

    @Column(nullable = false)
    private LocalDateTime purchaseDate; // Datum kupovine

    @Enumerated(EnumType.STRING)
    private TicketStatus status; // Status karte (npr. aktivna, iskorištena, otkazana)

    // Getteri i setteri

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Projection getProjection() {
        return projection;
    }

    public void setProjection(Projection projection) {
        this.projection = projection;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public TicketType getType() {
        return type;
    }

    public void setType(TicketType type) {
        this.type = type;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}

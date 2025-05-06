package com.example.cinemaplus.reservation.model;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.seat.model.model.Seat;
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
public class Reservation {

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

    @Column(nullable = false)
    private LocalDateTime reservationDate; // Datum rezervacije

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status; // Status rezervacije (npr. aktivna, otkazana)

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

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}

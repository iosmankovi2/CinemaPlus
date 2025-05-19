package com.example.cinemaplus.hall.hall.model;

import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.seat.model.model.Seat;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int numberOfRows;
    private int seatsPerRow;

    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL)
    private List<Projection> projections;

    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL)
    private List<Seat> seats;

    // === KONSTRUKTORI ===

    public Hall() {}

    public Hall(String name, int numberOfRows, int seatsPerRow) {
        this.name = name;
        this.numberOfRows = numberOfRows;
        this.seatsPerRow = seatsPerRow;
    }

    // === GETTERI I SETTERI ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNumberOfRows() {
        return numberOfRows;
    }

    public void setNumberOfRows(int numberOfRows) {
        this.numberOfRows = numberOfRows;
    }

    public int getSeatsPerRow() {
        return seatsPerRow;
    }

    public void setSeatsPerRow(int seatsPerRow) {
        this.seatsPerRow = seatsPerRow;
    }

    public List<Projection> getProjections() {
        return projections;
    }

    public void setProjections(List<Projection> projections) {
        this.projections = projections;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}
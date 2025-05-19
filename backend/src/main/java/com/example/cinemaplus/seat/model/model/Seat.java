package com.example.cinemaplus.seat.model.model;

import com.example.cinemaplus.hall.hall.model.Hall;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rowNumber;
    private int seatNumber;
    private boolean taken;

    @ManyToOne
    @JoinColumn(name = "hall_id")
    private Hall hall;

    // Getteri i setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRowNumber() { return rowNumber; }
    public void setRowNumber(int rowNumber) { this.rowNumber = rowNumber; }

    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }

    public boolean isTaken() { return taken; }
    public void setTaken(boolean taken) { this.taken = taken; }

    public Hall getHall() { return hall; }
    public void setHall(Hall hall) { this.hall = hall; }

    public String getRow() {
        return String.valueOf((char) ('A' + rowNumber - 1));
    }

    public String getNumber() {
        return String.valueOf(seatNumber);
    }

    public String getLabel() {
        char rowLetter = (char) ('A' + rowNumber - 1);
        return rowLetter + String.valueOf(seatNumber); // npr. B5
    }

}
package com.example.cinemaplus.ticket.model.dto;

import com.example.cinemaplus.ticket.model.TicketType;

import java.util.List;

public class TicketDTO {
    private Long id;
    private String movieTitle;
    private String date;
    private String time;
    private String hallName;
    private List<String> seats;
    private String price;
    private String purchasedAt;
    private String status;
    private TicketType type;


    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getHallName() { return hallName; }
    public void setHallName(String hallName) { this.hallName = hallName; }

    public List<String> getSeats() { return seats; }
    public void setSeats(List<String> seats) { this.seats = seats; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(String purchasedAt) { this.purchasedAt = purchasedAt; }
}

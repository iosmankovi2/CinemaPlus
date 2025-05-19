package com.example.cinemaplus.hall.hall.dto;

import java.util.List;

public class HallReservationRequest {
    private Long hallId;
    private Long userId;
    private List<Long> seatIds; // Možda želiš rezervirati određena sjedala unutar sale

    // Getters and setters
    public Long getHallId() {
        return hallId;
    }

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }
}
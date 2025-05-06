package com.example.cinemaplus.seat.model.dto;

import java.util.List;

public class SeatReservationRequest {
    private List<Long> seatIds;

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }
}
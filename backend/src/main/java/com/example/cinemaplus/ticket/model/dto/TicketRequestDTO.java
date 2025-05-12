package com.example.cinemaplus.ticket.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TicketRequestDTO {
    // Getteri i setteri
    private Long userId;
    private Long projectionId;
    private List<Long> seatIds;
    private String type; // E_TICKET, EMAIL_TICKET, PHYSICAL_PICKUP

    @Override
    public String toString() {
        return "TicketRequestDTO{" +
                "userId=" + userId +
                ", projectionId=" + projectionId +
                ", seatIds=" + seatIds +
                ", type='" + type + '\'' +
                '}';
    }
}

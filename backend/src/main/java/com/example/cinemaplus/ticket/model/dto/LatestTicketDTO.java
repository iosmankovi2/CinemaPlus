package com.example.cinemaplus.ticket.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LatestTicketDTO {
    private String movieTitle;
    private String userName;
    private String price;
}

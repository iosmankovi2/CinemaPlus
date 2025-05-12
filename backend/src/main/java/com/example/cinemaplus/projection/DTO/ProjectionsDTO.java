package com.example.cinemaplus.projection.DTO;

import java.time.LocalDateTime;
import com.example.cinemaplus.projection.model.ProjectionType;

public record ProjectionsDTO(
        Long id,
        LocalDateTime startTime,
        ProjectionType projectionType,
        double ticketPrice,
        String movieTitle,
        String hallName,
        Long hallId
) {}

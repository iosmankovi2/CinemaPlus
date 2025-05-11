package com.example.cinemaplus.projection.DTO;

import java.time.LocalDateTime;
import com.example.cinemaplus.projection.model.ProjectionType;

public class ProjectionsCreateDTO {
    private LocalDateTime startTime;
    private ProjectionType projectionType;
    private double ticketPrice;
    private Long movieId;
    private Long hallId;

    // Getters and setters
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public ProjectionType getProjectionType() { return projectionType; }
    public void setProjectionType(ProjectionType projectionType) { this.projectionType = projectionType; }

    public double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(double ticketPrice) { this.ticketPrice = ticketPrice; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Long getHallId() { return hallId; }
    public void setHallId(Long hallId) { this.hallId = hallId; }
}

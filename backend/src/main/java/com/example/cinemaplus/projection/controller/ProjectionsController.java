package com.example.cinemaplus.projection.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cinemaplus.projection.DTO.ProjectionsDTO;
import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.repository.ProjectionRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectionsController {

    private final ProjectionRepository projectionRepository;

    public ProjectionsController(ProjectionRepository projectionRepository) {
        this.projectionRepository = projectionRepository;
    }

    @GetMapping("/api/projections")
    public List<ProjectionsDTO> getProjectionsByMovieAndDate(
        @RequestParam Long movieId,
        @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime start = localDate.atStartOfDay();
        LocalDateTime end = localDate.plusDays(1).atStartOfDay();

        List<Projection> projections = projectionRepository.findByMovieIdAndStartTimeBetween(movieId, start, end);

        return (List<ProjectionsDTO>) projections.stream()
                .map(p -> new ProjectionsDTO(
                        p.getId(),
                        p.getStartTime(),
                        p.getProjectionType(),
                        p.getTicketPrice()))
                .collect(Collectors.toList());
    }
}

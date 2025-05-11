package com.example.cinemaplus.projection.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.function.Supplier;

import com.example.cinemaplus.hall.model.model.Hall;
import com.example.cinemaplus.hall.model.repository.HallRepository;
import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.repository.MovieRepository;
import com.example.cinemaplus.projection.DTO.ProjectionsCreateDTO;
import com.example.cinemaplus.projection.DTO.ProjectionsDTO;
import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.repository.ProjectionRepository;

@RestController
@RequestMapping("/api/projections")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectionsController {
     @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private HallRepository hallRepository;

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
                        p.getTicketPrice(),
                        p.getMovie().getTitle(),     
                        p.getHall().getName()))
                .collect(Collectors.toList());
    }
    @GetMapping("/all")
    public List<ProjectionsDTO> getAllProjections() {
        return projectionRepository.findAll().stream()
        .map(p -> new ProjectionsDTO(
                p.getId(),
                p.getStartTime(),
                p.getProjectionType(),
                p.getTicketPrice(),
                p.getMovie().getTitle(),     
                p.getHall().getName()))
        .collect(Collectors.toList());
}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProjection(@PathVariable Long id) {
        if (!projectionRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Projection not found");
        }

        projectionRepository.deleteById(id);
        return ResponseEntity.ok("Projection deleted successfully");
    }

    @PostMapping
    public ResponseEntity<?> addProjection(@RequestBody ProjectionsCreateDTO dto) {
        Projection p = new Projection();
        p.setStartTime(dto.getStartTime());
        p.setProjectionType(dto.getProjectionType());
        p.setTicketPrice(dto.getTicketPrice());
    
       Movie movie = movieRepository.findById(dto.getMovieId());
        if (movie == null) {
            throw new RuntimeException("Movie not found");
        }
        p.setMovie(movie);
        p.setHall(
            hallRepository.findById(dto.getHallId())
                .orElseThrow(new java.util.function.Supplier<RuntimeException>() {
                    @Override
                    public RuntimeException get() {
                        return new RuntimeException("Hall not found");
                    }
                })
        );
    
        projectionRepository.save(p);
        ProjectionsDTO responseDto = new ProjectionsDTO(
            p.getId(),
            p.getStartTime(),
            p.getProjectionType(),
            p.getTicketPrice(),
            p.getMovie().getTitle(),
            p.getHall().getName()
        );
    
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
        @PutMapping("/{id}")
        public ResponseEntity<?> updateProjection(@PathVariable Long id, @RequestBody ProjectionsCreateDTO dto) {
        if (dto.getMovieId() == null || dto.getHallId() == null) {
            return ResponseEntity.badRequest().body("Movie ID and Hall ID must be provided.");
        }

        Optional<Projection> optionalProjection = projectionRepository.findById(id);
        if (!optionalProjection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Projection not found");
        }

        Optional<Hall> optionalHall = hallRepository.findById(dto.getHallId());
        if (!optionalHall.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hall not found");
        }

        Movie movie = movieRepository.findById(dto.getMovieId());
        if (movie == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }

        Projection existing = optionalProjection.get();
        existing.setStartTime(dto.getStartTime());
        existing.setProjectionType(dto.getProjectionType());
        existing.setTicketPrice(dto.getTicketPrice());
        existing.setMovie(movie);
        existing.setHall(optionalHall.get());

        projectionRepository.save(existing);

        ProjectionsDTO responseDto = new ProjectionsDTO(
            existing.getId(),
            existing.getStartTime(),
            existing.getProjectionType(),
            existing.getTicketPrice(),
            existing.getMovie().getTitle(),
            existing.getHall().getName()
        );
    
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }


}

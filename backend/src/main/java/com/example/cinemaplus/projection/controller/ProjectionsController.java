package com.example.cinemaplus.projection.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cinemaplus.hall.hall.model.Hall;
import com.example.cinemaplus.hall.hall.repository.HallRepository;
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

    @GetMapping("/by-date")
    public List<ProjectionsDTO> getProjectionsByMovieAndDate(
            @RequestParam Long movieId,
            @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime start = localDate.atStartOfDay();
        LocalDateTime end = localDate.plusDays(1).atStartOfDay();

        return projectionRepository.findByMovieIdAndStartTimeBetween(movieId, start, end)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<ProjectionsDTO> getAllProjections() {
        return projectionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
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
    public ResponseEntity<ProjectionsDTO> addProjection(@RequestBody ProjectionsCreateDTO dto) {
        Projection projection = new Projection();
        projection.setStartTime(dto.getStartTime());
        projection.setProjectionType(dto.getProjectionType());
        projection.setTicketPrice(dto.getTicketPrice());

        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        projection.setMovie(movie);

        Hall hall = hallRepository.findById(dto.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));
        projection.setHall(hall);

        projectionRepository.save(projection);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(projection));
    }
    @Autowired
    private com.example.cinemaplus.projection.init.ProjectionDataLoader projectionDataLoader;

    @GetMapping("/debug-load-projections")
    public ResponseEntity<String> manuallyTriggerProjectionLoading() {
        projectionDataLoader.loadProjections();
        return ResponseEntity.ok("✅ Projekcije su pokušane dodati.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProjection(@PathVariable Long id, @RequestBody ProjectionsCreateDTO dto) {
        Optional<Projection> optionalProjection = projectionRepository.findById(id);
        if (optionalProjection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Projection not found");
        }

        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Hall hall = hallRepository.findById(dto.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        Projection existing = optionalProjection.get();
        existing.setStartTime(dto.getStartTime());
        existing.setProjectionType(dto.getProjectionType());
        existing.setTicketPrice(dto.getTicketPrice());
        existing.setMovie(movie);
        existing.setHall(hall);

        projectionRepository.save(existing);
        return ResponseEntity.ok(mapToDTO(existing));
    }

    // 📦 Pomoćna metoda za mapiranje entiteta u DTO
    private ProjectionsDTO mapToDTO(Projection p) {
        return new ProjectionsDTO(
                p.getId(),
                p.getStartTime(),
                p.getProjectionType(),
                p.getTicketPrice(),
                p.getMovie().getTitle(),
                p.getHall().getName(),
                p.getHall().getId()
        );
    }
}

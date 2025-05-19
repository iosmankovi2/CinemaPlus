package com.example.cinemaplus.projection.init;

import com.example.cinemaplus.hall.hall.model.Hall;
import com.example.cinemaplus.hall.hall.repository.HallRepository;
import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.repository.MovieRepository;
import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.model.ProjectionType;
import com.example.cinemaplus.projection.repository.ProjectionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class ProjectionDataLoader {

    @Autowired
    private ProjectionRepository projectionRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private HallRepository hallRepository;

    @PostConstruct
    public void loadProjections() {
        List<Movie> movies = movieRepository.findAll();
        List<Hall> halls = hallRepository.findAll();

        if (movies.isEmpty() || halls.isEmpty()) {
            System.out.println("Nema filmova ili sala za kreiranje projekcija.");
            return;
        }

        LocalDate today = LocalDate.now();
        int brojDana = 3; // danas + 2 dana

        for (int d = 0; d < brojDana; d++) {
            for (Movie movie : movies) {
                for (int t = 0; t < 3; t++) {
                    LocalTime time;
                    switch (t) {
                        case 0 -> time = LocalTime.of(17, 0);
                        case 1 -> time = LocalTime.of(19, 30);
                        default -> time = LocalTime.of(22, 0);
                    }

                    LocalDateTime startTime = today.plusDays(d).atTime(time);
                    Hall hall = halls.get((movie.getId().intValue() + t) % halls.size());

                    boolean alreadyExists = projectionRepository
                            .findByMovieIdAndStartTimeBetween(movie.getId(), startTime.minusMinutes(1), startTime.plusMinutes(1))
                            .stream()
                            .anyMatch(p -> p.getHall().getId().equals(hall.getId()));

                    if (!alreadyExists) {
                        Projection p = new Projection();
                        p.setMovie(movie);
                        p.setHall(hall);
                        p.setStartTime(startTime);
                        p.setProjectionType(ProjectionType.THREE_D);
                        p.setTicketPrice(7.0 + t);

                        projectionRepository.save(p);
                        System.out.println("✔ Dodana projekcija za " + movie.getTitle() + " u sali " + hall.getName() + " u " + startTime);
                    }
                }
            }
        }
    }
}

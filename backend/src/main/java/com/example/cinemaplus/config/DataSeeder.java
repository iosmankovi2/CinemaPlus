package com.example.cinemaplus.config;

import com.example.cinemaplus.projection.repository.ProjectionRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import com.example.cinemaplus.user.model.Role;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.model.UserStatus;
import com.example.cinemaplus.user.repository.UserRepository;
import com.example.cinemaplus.movie.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.cinemaplus.hall.hall.model.Hall;
import com.example.cinemaplus.hall.hall.repository.HallRepository;
import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.projection.model.Projection;
import com.example.cinemaplus.projection.model.ProjectionType;


import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            HallRepository hallRepository,
            SeatRepository seatRepository,
            MovieRepository movieRepository,
            ProjectionRepository projectionRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ✅ Seed Halls and Seats
            if (hallRepository.count() == 0) {
                Hall hall1 = hallRepository.save(new Hall("4D Hall", 5, 10));
                Hall hall2 = hallRepository.save(new Hall("3D Hall", 8, 12));
                Hall hall3 = hallRepository.save(new Hall("Birthday party venue", 4, 6));

                for (Hall hall : List.of(hall1, hall2, hall3)) {
                    for (int i = 0; i < hall.getNumberOfRows(); i++) {
                        for (int j = 0; j < hall.getSeatsPerRow(); j++) {
                            Seat seat = new Seat();
                            seat.setRowNumber(i + 1);
                            seat.setSeatNumber(j + 1);
                            seat.setTaken(false);
                            seat.setHall(hall);
                            seatRepository.save(seat);
                        }
                    }
                }

                System.out.println("✅ Seeded halls and seats.");
            }

            // ✅ Seed Movies
            if (movieRepository.count() == 0) {
                List<Movie> movies = List.of(
                        new Movie("Barbie", "Barbie embarks on a journey of self-discovery after leaving Barbieland.",
                                114, "Comedy", "Greta Gerwig", "Margot Robbie, Ryan Gosling", 2023,
                                true, "https://www.youtube.com/embed/pBk4NYhWNMM",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"),

                        new Movie("Dune: Part Two", "Continuation of Paul Atreides’ journey.",
                                166, "Sci-Fi", "Denis Villeneuve", "Timothée Chalamet, Zendaya", 2024,
                                true, "https://www.youtube.com/embed/Way9Dexny3w",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg"),

                        new Movie("Everything Everywhere...", "A woman discovers alternate realities.",
                                139, "Adventure", "Daniel Kwan", "Michelle Yeoh, Ke Huy Quan", 2022,
                                true, "https://www.youtube.com/embed/tgB1wUcmbbw",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/uBo6E7nbpwoEM8H7FSJPta6aGYB.jpg"),

                        new Movie("Avatar: The Way of Water", "Jake Sully lives with his family on Pandora, facing new threats.",
                                192, "Sci-Fi", "James Cameron", "Sam Worthington, Zoe Saldana", 2022,
                                true, "https://www.youtube.com/embed/d9MyW72ELq0",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"),

                        new Movie("Spider-Man: Across the Spider-Verse", "Miles Morales returns to the multiverse and meets a team of Spider-People.",
                                140, "Animation", "Joaquim Dos Santos", "Shameik Moore, Hailee Steinfeld", 2023,
                                true, "https://www.youtube.com/embed/cqGjhVJWtEg",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"),

                        new Movie("The Batman", "The Batman fights corruption in Gotham.",
                                176, "Action", "Matt Reeves", "Robert Pattinson, Zoë Kravitz", 2022,
                                false, "https://www.youtube.com/embed/mqqft2x_Aa4",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/74xTEgt7R36Fpooo50r9T25onhq.jpg"),

                        new Movie("Oppenheimer", "Life of atomic bomb creator J. Robert Oppenheimer.",
                                180, "Drama", "Christopher Nolan", "Cillian Murphy, Emily Blunt", 2023,
                                true, "https://www.youtube.com/embed/uYPbbksJxIg",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),

                        new Movie("The Whale", "A reclusive English teacher living with severe obesity attempts to reconnect with his daughter.",
                                117, "Drama", "Darren Aronofsky", "Brendan Fraser, Sadie Sink", 2022,
                                false, "https://www.youtube.com/embed/nWiQodhMvz4",
                                "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg")
                );

                movieRepository.saveAll(movies);
                System.out.println("✅ Seeded all movies.");
            }

            // ✅ Seed Projections
            if (projectionRepository.count() == 0 && movieRepository.count() > 0 && hallRepository.count() > 0) {
                Movie movie = movieRepository.findAll().get(0);
                Hall hall = hallRepository.findAll().get(0);

                Projection projection = new Projection();
                projection.setMovie(movie);
                projection.setHall(hall);
                projection.setStartTime(LocalDateTime.now().plusDays(1));
                projection.setTicketPrice(10.0);
                projection.setProjectionType(ProjectionType.TWO_D);

                projectionRepository.save(projection);

                System.out.println("✅ Seeded projection.");
            }

            // ✅ Seed Admin User
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@cinemaplus.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.Admin);
                admin.setUserStatus(UserStatus.ACTIVE);
                admin.setDateCreated(LocalDateTime.now().toString());
                admin.setLastLogin(null);

                userRepository.save(admin);

                System.out.println("✅ Seeded admin user (email: admin@cinemaplus.com, pass: admin123).");
            }
        };
    }
}

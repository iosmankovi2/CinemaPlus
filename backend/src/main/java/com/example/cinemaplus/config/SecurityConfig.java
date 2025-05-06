package com.example.cinemaplus.config;

import com.example.cinemaplus.hall.model.model.Hall;
import com.example.cinemaplus.hall.model.repository.HallRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean

    public CommandLineRunner runner(HallRepository hallRepository, SeatRepository seatRepository) {
        return args -> {
            Hall hall1 = new Hall("4D Sala", 5, 10);
            Hall hall2 = new Hall("3D Sala", 6, 12);
            Hall hall3 = new Hall("Rođendaonica", 4, 8);

            hall1 = hallRepository.save(hall1);
            hall2 = hallRepository.save(hall2);
            hall3 = hallRepository.save(hall3);

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
        };
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form.disable())   // Isključuje login formu
                .httpBasic(httpBasic -> httpBasic.disable()); // Isključuje basic auth

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
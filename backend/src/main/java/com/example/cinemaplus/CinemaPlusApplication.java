package com.example.cinemaplus;

import com.example.cinemaplus.hall.model.Hall;
import com.example.cinemaplus.hall.repository.HallRepository;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CinemaPlusApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinemaPlusApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(HallRepository hallRepository, SeatRepository seatRepository) {
		return args -> {
			Hall hall1 = hallRepository.save(new Hall("4D Sala", 5, 10));
			Hall hall2 = hallRepository.save(new Hall("3D Sala", 8, 12));
			Hall hall3 = hallRepository.save(new Hall("Rođendaonica", 4, 6));

			for (Hall hall : List.of(hall1, hall2, hall3)) {
				for (int i = 0; i < hall.getNumberOfRows(); i++) {
					for (int j = 0; j < hall.getSeatsPerRow(); j++) {
						Seat seat = new Seat();
						seat.setRowNumber(i + 1);
						seat.setSeatNumber(j + 1);
						seat.setTaken(false); // svi slobodni
						seat.setHall(hall);
						seatRepository.save(seat);
					}
				}
			}
		};
	}
}
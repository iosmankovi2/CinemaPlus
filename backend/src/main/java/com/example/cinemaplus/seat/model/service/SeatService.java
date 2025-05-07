package com.example.cinemaplus.seat.model.service;

import com.example.cinemaplus.hall.model.model.Hall;
import com.example.cinemaplus.hall.model.repository.HallRepository;
import com.example.cinemaplus.seat.model.dto.SeatDTO;
import com.example.cinemaplus.seat.model.model.Seat;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private HallRepository hallRepository;

    public List<SeatDTO> getSeatsForHall(Long hallId) {
        Optional<Hall> hall = hallRepository.findById(hallId);
        if (hall.isEmpty()) return List.of();

        return seatRepository.findByHall(hall.get())
                .stream()
                .map(seat -> {
                    SeatDTO dto = new SeatDTO();
                    dto.setId(seat.getId());
                    dto.setRowNumber(seat.getRowNumber());
                    dto.setSeatNumber(seat.getSeatNumber());
                    dto.setTaken(seat.isTaken());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public boolean reserveSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        boolean allAvailable = seats.stream().allMatch(seat -> !seat.isTaken());

        if (!allAvailable) return false;

        for (Seat seat : seats) {
            seat.setTaken(true);
        }

        seatRepository.saveAll(seats);
        return true;
    }
}
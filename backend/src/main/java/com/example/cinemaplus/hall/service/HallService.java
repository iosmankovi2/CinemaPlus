package com.example.cinemaplus.hall.service;

import com.example.cinemaplus.hall.dto.HallDTO;
import com.example.cinemaplus.hall.repository.HallRepository;
import com.example.cinemaplus.seat.model.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallService {

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<HallDTO> getAllHalls() {
        return hallRepository.findAll()
                .stream()
                .map(hall -> {
                    HallDTO dto = new HallDTO();
                    dto.setId(hall.getId());
                    dto.setName(hall.getName());
                    dto.setTotalSeats(hall.getNumberOfRows() * hall.getSeatsPerRow());
                    long available = seatRepository.countByHallAndTakenFalse(hall);
                    dto.setAvailableSeats((int) available);



                    return dto;
                })
                .collect(Collectors.toList());
    }
}
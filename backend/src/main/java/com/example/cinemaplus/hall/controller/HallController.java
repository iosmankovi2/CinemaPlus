package com.example.cinemaplus.hall.controller;

import com.example.cinemaplus.hall.dto.HallDTO;
import com.example.cinemaplus.hall.service.HallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
public class HallController {

    @Autowired
    private HallService hallService;

    @GetMapping
    public List<HallDTO> getAllHalls() {
        return hallService.getAllHalls();
    }
}
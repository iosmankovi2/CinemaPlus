package com.example.cinemaplus.search;

import com.example.cinemaplus.movie.model.Movie;
import com.example.cinemaplus.movie.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000") // ili 3001 ako koristiš to
public class SearchController {

    private final MovieRepository movieRepository;

    public SearchController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> search(@RequestParam("query") String query) {
        return movieRepository.findByTitleContainingIgnoreCase(query);
    }
}

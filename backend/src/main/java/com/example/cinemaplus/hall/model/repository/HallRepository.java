package com.example.cinemaplus.hall.model.repository;

import com.example.cinemaplus.hall.model.Hall;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;

public interface HallRepository extends JpaRepository<Hall, Long> {
    Collection<?> findByNameContainingIgnoreCase(String query);
}

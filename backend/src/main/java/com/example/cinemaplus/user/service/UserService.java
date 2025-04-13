package com.example.cinemaplus.user.service;

import com.example.cinemaplus.reservation.model.Reservation;
import com.example.cinemaplus.user.dto.UserDTO;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void registerUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email is already taken.");
        }
        User user = new User(userDTO.getName(), userDTO.getEmail(), userDTO.getPassword(), userDTO.getRole(), userDTO.getStatus(), "2025-04-14", "2025-04-14");
        userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty() || !user.get().getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }
        return user.get();
    }

    public void updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public List<Reservation> getUserHistory(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getReservations();
    }
}

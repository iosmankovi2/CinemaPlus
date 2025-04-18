package com.example.cinemaplus.user.service;

import com.example.cinemaplus.reservation.model.Reservation;
import com.example.cinemaplus.user.dto.UserDTO;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;
import com.example.cinemaplus.user.model.Role; // Prilagodi putanju prema tvojoj strukturi paketa
import com.example.cinemaplus.user.model.UserStatus;
import jakarta.transaction.Transactional;
import com.example.cinemaplus.exception.UserNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.Arrays;

import java.util.List;
import java.util.Optional;

import javax.net.ssl.SSLEngineResult.Status;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private UserRepository userRepository;

    @Transactional
public void registerUser(UserDTO userDTO) {
    validateUserDTO(userDTO);

    if (userRepository.existsByEmail(userDTO.getEmail())) {
        throw new IllegalArgumentException("Email is already in use.");
    }

    User user = new User(
            userDTO.getFirstName(),
            userDTO.getLastName(),
            userDTO.getEmail(),
            passwordEncoder.encode(userDTO.getPassword()), // Enkripcija lozinke
            userDTO.getRole(),
            userDTO.getUserStatus(),
            LocalDate.now().toString(),
            LocalDate.now().toString()
    );

    userRepository.save(user);
}

public List<User> getAllUsers() {
    return userRepository.findAll();
}


public User loginUser(String email, String password) {
    if (email == null || email.isBlank() || password == null || password.isBlank()) {
        throw new IllegalArgumentException("Email and password are required.");
    }

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                System.out.println("User not found with email: " + email);  // Logiranje
                return new RuntimeException("Invalid email or password.");
            });

    System.out.println("User found: " + user.getEmail());  // Logiranje

    if (!passwordEncoder.matches(password, user.getPassword())) {
        System.out.println("Password mismatch: entered=" + password + ", stored=" + user.getPassword());  // Logiranje
        throw new RuntimeException("Invalid email or password.");
    }

    System.out.println("Login successful");  // Logiranje
    return user;
}

public void updateUserRole(Long id, String role) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    try {
        Role enumRole = Arrays.stream(Role.values())
                              .filter(r -> r.name().equalsIgnoreCase(role))
                              .findFirst()
                              .orElseThrow(() -> new IllegalArgumentException("Invalid role: " + role));

        user.setRole(enumRole);
        userRepository.save(user);
    } catch (Exception e) {
        throw new IllegalArgumentException("Error updating role: " + e.getMessage());
    }
}
    @Transactional
    public void updateUser(Long id, UserDTO userDTO) {
        validateUserDTO(userDTO);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.User); 
        user.setUserStatus(UserStatus.ACTIVE);

        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));
        userRepository.delete(user);
    }

    public List<Reservation> getUserHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return user.getReservations();
    }

    // --- Helper method for validation ---
    private void validateUserDTO(UserDTO userDTO) {
        if (userDTO.getLastName() == null || userDTO.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required.");
        }
        if (userDTO.getFirstName() == null || userDTO.getFirstName().isBlank()) {
            
            throw new IllegalArgumentException("First name is required.");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }
        if (userDTO.getRole() == null) {
            userDTO.setRole(Role.User);  
        }
         
        if (userDTO.getUserStatus() == null) {
            userDTO.setUserStatus(UserStatus.ACTIVE);  
        }
    }
}
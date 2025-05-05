package com.example.cinemaplus.user.service;

import com.example.cinemaplus.reservation.model.Reservation;
import com.example.cinemaplus.user.dto.UserDTO;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.repository.UserRepository;
import com.example.cinemaplus.user.model.Role; // Prilagodi putanju prema tvojoj strukturi paketa
import com.example.cinemaplus.user.model.UserStatus;
import jakarta.transaction.Transactional;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;

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
            .orElseThrow(() -> new RuntimeException("Invalid email or password."));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid email or password.");
    }

    return user; // Return user object if login is successful
}


public User authenticateUser(String email, String password) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isPresent()) {
        User user = userOptional.get();
        if (passwordEncoder.matches(password, user.getPassword())) {
            user.setLastLogin(LocalDate.now().toString()); // Ažuriraj lastLogin
            userRepository.save(user); // Sačuvaj promjenu
            return user;
        }
    }
    return null;
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
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
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
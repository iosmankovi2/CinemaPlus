package com.example.cinemaplus.user.service;

import com.example.cinemaplus.reservation.model.Reservation;
import com.example.cinemaplus.reservation.repository.ReservationRepository;
import com.example.cinemaplus.user.dto.UpdateUserDTO;
import com.example.cinemaplus.user.dto.UserDTO;
import com.example.cinemaplus.user.model.Role;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.model.UserStatus;
import com.example.cinemaplus.user.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

     @Autowired
    private ReservationRepository reservationRepository;

    @Transactional
    public void registerUser(UserDTO userDTO) {
        validateUserDTOForRegistration(userDTO);

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        User user = new User(
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getEmail(),
                passwordEncoder.encode(userDTO.getPassword()),
                userDTO.getRole(),
                userDTO.getUserStatus(),
                LocalDate.now().toString(),
                LocalDate.now().toString()
        );

        userRepository.save(user);
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

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User authenticateUser(String email, String password) {
        System.out.println("Pokušaj autentifikacije: " + email);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            System.out.println("Email ne postoji u bazi.");
            return null;
        }
    
        User user = optionalUser.get();
    
        System.out.println("Upoređujem lozinke...");
        if (passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Lozinka odgovara.");
            return user;
        } else {
            System.out.println("Lozinka NIJE tačna.");
            return null;
        }
    }

     public User getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.orElse(null); // Vraća korisnika ako postoji, inače null
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

    private void validateUserDTOForRegistration(UserDTO userDTO) {
        if (userDTO.getFirstName() == null || userDTO.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required.");
        }
        if (userDTO.getLastName() == null || userDTO.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required.");
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

   public User updateUser(Long id, UpdateUserDTO updatedUserDTO) {
        Optional<User> existingUserOptional = userRepository.findById(id);
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            existingUser.setFirstName(updatedUserDTO.getFirstName());
            existingUser.setLastName(updatedUserDTO.getLastName());
            existingUser.setEmail(updatedUserDTO.getEmail());
            return userRepository.save(existingUser); // Sada vraćamo spremljenog korisnika
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

private void validateUpdateDTO(UpdateUserDTO dto) {
    if (dto.getFirstName() == null || dto.getFirstName().isBlank()) {
        throw new IllegalArgumentException("First name is required.");
    }
    if (dto.getLastName() == null || dto.getLastName().isBlank()) {
        throw new IllegalArgumentException("Last name is required.");
    }
    if (dto.getEmail() == null || dto.getEmail().isBlank()) {
        throw new IllegalArgumentException("Email is required.");
    }
}

public void updatePassword(Long id, String oldPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        User user = userOptional.get();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

public List<Reservation> getUserReservations(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

}
package com.example.cinemaplus.user.controller;
import java.io.Console;
import com.example.cinemaplus.reservation.model.Reservation;
import com.example.cinemaplus.user.dto.UpdateUserDTO;
import com.example.cinemaplus.user.dto.UserDTO;
import com.example.cinemaplus.user.model.User;
import com.example.cinemaplus.user.service.UserService;
import java.util.Date;
import com.example.cinemaplus.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.cinemaplus.security.JwtTokenUtil;
import jakarta.validation.Valid;
import java.time.LocalDate;
import com.example.cinemaplus.user.dto.LoginRequest;
import com.example.cinemaplus.user.dto.PasswordUpdateDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
  

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}
@GetMapping("/debug-auth")
public Object debugAuth(org.springframework.security.core.Authentication auth) {
    return java.util.Map.of(
        "name", auth != null ? auth.getName() : null,
        "authorities", auth != null ? auth.getAuthorities().toString() : null,
        "principal", auth != null ? auth.getPrincipal().getClass().getName() : null
    );
}

@GetMapping("/{id}")
@PreAuthorize("#id == principal.user.id") // Samo ulogirani korisnik može pristupiti svom profilu
public ResponseEntity<User> getUserById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
    User user = userService.getUserById(id);
    if (user != null) {
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}

    // Registracija korisnika
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>("Validation failed: " + bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
        }

        try {
            userService.registerUser(userDTO); 
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error during registration: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Pokušaj logina: " + loginRequest.getEmail());

        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            System.out.println("User pronađen: " + user.getEmail());
            String token = JwtTokenUtil.generateJwtToken(user);

            // 🔁 JSON odgovor koji frontend očekuje
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neispravni podaci za prijavu");
        }
    }



@GetMapping("/me")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getLoggedInUser(@AuthenticationPrincipal CustomUserDetails principal) {
    return ResponseEntity.ok(principal.getUser());
}



@PutMapping("/{id}")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO updatedUserDTO,
                                        BindingResult bindingResult, @AuthenticationPrincipal CustomUserDetails principal) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        try {
            User updatedUser = userService.updateUser(id, updatedUserDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
        }


    }

    @PutMapping("/{id}/password")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<String> updatePassword(@PathVariable Long id,
                                               @Valid @RequestBody PasswordUpdateDTO passwordUpdateDTO,
                                               BindingResult bindingResult,
                                               @AuthenticationPrincipal CustomUserDetails principal) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation failed: " + bindingResult.getAllErrors());
        }
        try {
            userService.updatePassword(id, passwordUpdateDTO.getOldPassword(), passwordUpdateDTO.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating password: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/data")
public ResponseEntity<String> adminData() {
    return ResponseEntity.ok("Samo ADMIN vidi ovo.");
}

@GetMapping("/reservations/user/{userId}")
@PreAuthorize("#userId == principal.user.id")
public ResponseEntity<List<Reservation>> getUserReservations(@PathVariable Long userId, @AuthenticationPrincipal CustomUserDetails principal) {
    List<Reservation> reservations = userService.getUserReservations(userId);
    return ResponseEntity.ok(reservations);
}

    // Brisanje korisnika
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return new ResponseEntity<>("Error during deletion: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/active-count")
    public Long countAllUsers() {
        return (long) userService.getAllUsers().size();
    
    }
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminUpdateUser(@PathVariable Long id,
                                         @Valid @RequestBody UpdateUserDTO updatedUserDTO,
                                         BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
    }
    try {
        User updatedUser = userService.updateUser(id, updatedUserDTO);
        return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
    }
}

}
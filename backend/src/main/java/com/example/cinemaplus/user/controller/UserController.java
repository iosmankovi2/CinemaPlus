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
import com.example.cinemaplus.security.JwtTokenUtil;
import jakarta.validation.Valid;
import java.time.LocalDate;
import com.example.cinemaplus.user.dto.LoginRequest;
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
  

    @GetMapping("/")
public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
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

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neispravni podaci za prijavu");
        }
    }



    @GetMapping("/me")
public ResponseEntity<User> getLoggedInUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(userDetails.getUser());
}

    // Ažuriranje korisnika
  @PutMapping("/{id}")
  public ResponseEntity<String> updateUser(@PathVariable Long id,
                                         @Valid @RequestBody UpdateUserDTO updatedUserDTO,
                                         BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        return new ResponseEntity<>("Validation failed: " + bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
    }

    try {
        userService.updateUser(id, updatedUserDTO);
        return ResponseEntity.ok("User updated successfully");
    } catch (Exception e) {
        return new ResponseEntity<>("Error during update: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    @PreAuthorize("hasRole('ROLE_Admin')")
@GetMapping("/admin/data")
public ResponseEntity<String> adminData() {
    return ResponseEntity.ok("Samo ADMIN vidi ovo.");
}



    // Brisanje korisnika
    @DeleteMapping("/{id}")
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
}
package com.example.cinemaplus.user.dto;

import com.example.cinemaplus.user.model.Role;
import com.example.cinemaplus.user.model.UserStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateUserDTO {

    @NotBlank(message = "First name is mandatory")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Pattern(
        regexp = "^(?!.*\\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Email should be a valid format (e.g. name@domain.com)"
    )
    private String email;

    private String password; // Optional
    private Role role;
    private UserStatus userStatus;

    public String getFirstName() { return firstName; }
    public void setFirstName(String name) { this.firstName = name; }

    public String getLastName() { return lastName; }
    public void setLastName(String name) { this.lastName = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getUserStatus() { return userStatus; }
    public void setUserStatus(UserStatus status) { this.userStatus = status; }
}

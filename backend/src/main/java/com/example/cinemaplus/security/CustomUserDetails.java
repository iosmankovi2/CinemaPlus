package com.example.cinemaplus.security;

import com.example.cinemaplus.user.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // Dodjeljuje rolu korisniku (npr. ROLE_USER ili ROLE_ADMIN)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // možeš dodati logiku ako koristiš expire datume
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // isto kao gore, možeš dodati zaključavanje
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // npr. za isteklu lozinku
    }

    @Override
    public boolean isEnabled() {
        return true; // možeš koristiti user.getStatus().equals("ACTIVE") ako želiš
    }

    public User getUser() {
        return user;
    }
}

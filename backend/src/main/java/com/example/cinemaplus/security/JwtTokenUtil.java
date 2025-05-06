package com.example.cinemaplus.security;

import io.jsonwebtoken.JwtException; // Dodajte ovaj import
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.example.cinemaplus.user.model.User;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JwtTokenUtil {



private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // Korisničko ime je subject
                .setIssuedAt(new Date()) // Datum kada je token izdat
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Token važi 10 sati
                .signWith(SECRET_KEY) // Potpisivanje tokena
                .compact(); // Kompaktan oblik tokena
    }

   // JwtTokenUtil.java

public static String getEmailFromToken(String token) {
    // Izvucite email iz tokena koristeći JWT library
    // Pretpostavljam da koristite JWT, pa možete koristiti getClaim
    return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Pretpostavljamo da je email postavljen kao subject u tokenu
}

// JwtTokenUtil.java

public static boolean isValidToken(String token) {
    try {
        Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
        return true; // Token je validan
    } catch (JwtException | IllegalArgumentException e) {
        return false; // Token nije validan
    }
}

}
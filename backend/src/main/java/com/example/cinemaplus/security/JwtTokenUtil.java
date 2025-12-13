package com.example.cinemaplus.security;

import com.example.cinemaplus.user.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtTokenUtil {

    private static final String SECRET = "tajni_kljuc_koji_je_dug_bar_32_znaka_treba_biti";
    private static final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 10; // 10h

    public static String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name().toUpperCase())   // <-- USER / ADMIN
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public static String getRoleFromToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public static boolean isValidToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private static Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

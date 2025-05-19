package com.example.cinemaplus.payment.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    static {
        Stripe.apiKey = "sk_test_51RPmGEF5Zs94DDSk5hxwrXw26yt4hpb1NNOUsp9yPbvMyl8Jau35IJgtxBXi5wXdLOHBaj5uJLeNxqEEv2v6hy4N00OPPuATYY"; // ➕ zamijeni sa svojom Stripe secret key
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            int amount = (int) payload.getOrDefault("amount", 1500); // ➕ dinamički ako želiš
            String movieTitle = (String) payload.getOrDefault("movieTitle", "Cinema Ticket");

            List<Object> lineItems = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("price_data", Map.of(
                "currency", "usd",
                "unit_amount", amount,
                "product_data", Map.of("name", movieTitle)
            ));
            item.put("quantity", 1);
            lineItems.add(item);

            Map<String, Object> params = new HashMap<>();
            params.put("line_items", lineItems);
            params.put("mode", "payment");
            params.put("success_url", "http://localhost:3000/success");
            params.put("cancel_url", "http://localhost:3000/cancel");

            Session session = Session.create(params);
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}

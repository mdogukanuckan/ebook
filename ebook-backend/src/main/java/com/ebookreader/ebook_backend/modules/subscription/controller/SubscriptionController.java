package com.ebookreader.ebook_backend.modules.subscription.controller;

import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionResponseDTO> assignSubscription(@Valid @RequestBody SubscriptionRequestDTO request) {
        log.info("Admin tarafından abonelik atama isteği alındı. Hedef UserID: {}", request.getUserId());
        SubscriptionResponseDTO response = subscriptionService.assignPlan(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<SubscriptionResponseDTO> getMySubscription() {
        log.info("Kullanıcı kendi abonelik bilgilerini sorguluyor.");
        SubscriptionResponseDTO response = subscriptionService.getUserSubscription();
        return ResponseEntity.ok(response);
    }
}

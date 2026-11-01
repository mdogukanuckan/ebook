package com.ebookreader.ebook_backend.modules.subscription.controller;

import com.ebookreader.ebook_backend.modules.subscription.dto.SubscribeRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionResponseDTO> subscribe(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SubscribeRequestDTO request) {
        return ResponseEntity.ok(subscriptionService.subscribeToPlan(user.getId(), request.getPlanId()));
    }

    @GetMapping("/my")
    public ResponseEntity<SubscriptionResponseDTO> getMySubscription() {
        log.info("Kullanıcı kendi abonelik bilgilerini sorguluyor.");
        SubscriptionResponseDTO response = subscriptionService.getUserSubscription();
        return ResponseEntity.ok(response);
    }
}

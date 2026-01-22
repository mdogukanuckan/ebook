package com.ebookreader.ebook_backend.modules.subscription.dto;

import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SubscriptionResponseDTO {
    private Long id;
    private Long userId;
    private String username;
    private SubscriptionPlan plan;
    private BigDecimal price;
    private String currency;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean autoRenew;
    private boolean isActive;
}

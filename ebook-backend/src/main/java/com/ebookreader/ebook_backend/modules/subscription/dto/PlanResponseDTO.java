package com.ebookreader.ebook_backend.modules.subscription.dto;

import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PlanResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private int durationDays;
    private SubscriptionPlan subscriptionPlan;
    private boolean isActive;
}

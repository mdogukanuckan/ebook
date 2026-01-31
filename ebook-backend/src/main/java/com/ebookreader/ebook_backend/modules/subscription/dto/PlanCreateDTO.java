package com.ebookreader.ebook_backend.modules.subscription.dto;

import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PlanCreateDTO {
    @NotBlank(message = "Plan adı boş olamaz")
    private String name;

    private String description;

    @NotNull(message = "Fiyat boş olamaz")
    @DecimalMin(value = "0.0", message = "Fiyat 0'dan küçük olamaz")
    private BigDecimal price;

    @NotNull(message = "Süre boş olamaz")
    private Integer durationDays;

    @NotNull(message = "Erişim seviyesi seçilmelidir")
    private SubscriptionPlan subscriptionPlan;
}

package com.ebookreader.ebook_backend.modules.subscription.dto;

import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SubscriptionRequestDTO {
    @NotNull(message = "Kullanıcı ID boş olamaz")
    private Long userId;

    @NotNull(message = "Abonelik planı seçilmelidir")
    private SubscriptionPlan plan;
    private BigDecimal customPrice;

    private boolean autoRenew = true;

}

package com.ebookreader.ebook_backend.modules.subscription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscribeRequestDTO {
    @NotNull(message = "Plan ID boş olamaz")
    private Long planId;
}

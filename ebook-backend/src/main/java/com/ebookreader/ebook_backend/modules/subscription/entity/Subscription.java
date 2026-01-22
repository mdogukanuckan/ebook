package com.ebookreader.ebook_backend.modules.subscription.entity;

import com.ebookreader.ebook_backend.common.base.BaseEntity;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Subscription extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionPlan plan;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    private String currency = "TRY";

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Builder.Default
    private boolean autoRenew = true;

    @Builder.Default
    private boolean isActive = true;

    public boolean isValid(){
        return isActive && (endDate ==null ||endDate.isAfter(LocalDateTime.now()));
    }

}

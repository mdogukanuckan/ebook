package com.ebookreader.ebook_backend.modules.subscription.mapper;

import com.ebookreader.ebook_backend.modules.subscription.dto.PlanResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import com.ebookreader.ebook_backend.modules.subscription.entity.Subscription;
import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The response DTOs used to declare "isActive", which MapStruct's builder did not match with the
 * entities' "active" property, so the flag was silently dropped and always serialized as false.
 */
class ActiveFlagMappingTest {

    private final SubscriptionMapper subscriptionMapper = new SubscriptionMapperImpl();
    private final PlanMapper planMapper = new PlanMapperImpl();

    private static Subscription subscription(boolean active) {
        User user = User.builder().username("ali").build();
        user.setId(1L);
        return Subscription.builder().user(user).plan(SubscriptionPlan.PREMIUM).isActive(active).build();
    }

    private static Plan plan(boolean active) {
        return Plan.builder().name("Premium").price(BigDecimal.TEN).subscriptionPlan(SubscriptionPlan.PREMIUM)
                .isActive(active).build();
    }

    @Test
    void activeSubscription_isMappedAsActive() {
        SubscriptionResponseDTO dto = subscriptionMapper.toResponse(subscription(true));

        assertThat(dto.isActive()).isTrue();
    }

    @Test
    void inactiveSubscription_isMappedAsInactive() {
        SubscriptionResponseDTO dto = subscriptionMapper.toResponse(subscription(false));

        assertThat(dto.isActive()).isFalse();
    }

    @Test
    void activePlan_isMappedAsActive() {
        PlanResponseDTO dto = planMapper.toResponse(plan(true));

        assertThat(dto.isActive()).isTrue();
    }

    @Test
    void inactivePlan_isMappedAsInactive() {
        PlanResponseDTO dto = planMapper.toResponse(plan(false));

        assertThat(dto.isActive()).isFalse();
    }
}

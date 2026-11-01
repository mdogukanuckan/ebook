package com.ebookreader.ebook_backend.modules.subscription.service;

import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.User;

public interface SubscriptionService {

    SubscriptionResponseDTO assignPlan(SubscriptionRequestDTO request);

    SubscriptionResponseDTO subscribeToPlan(Long userId, Long planId);
    SubscriptionResponseDTO getUserSubscription();

    boolean canAccessBook(Long userId, Long BookId);

    void createDefaultSubscription(User user);
}

package com.ebookreader.ebook_backend.modules.subscription.service;

import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;

public interface SubscriptionService {

    SubscriptionResponseDTO assignPlan(SubscriptionRequestDTO request);

    SubscriptionResponseDTO getUserSubscription();

    boolean canAccessBook(Long userId, Long BookId);
}

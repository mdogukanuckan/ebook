package com.ebookreader.ebook_backend.modules.subscription.repository;

import com.ebookreader.ebook_backend.modules.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    Optional<Subscription> findByUserId(Long userId);
}

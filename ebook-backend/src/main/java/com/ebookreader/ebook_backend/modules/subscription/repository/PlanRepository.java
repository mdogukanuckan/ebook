package com.ebookreader.ebook_backend.modules.subscription.repository;

import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
}

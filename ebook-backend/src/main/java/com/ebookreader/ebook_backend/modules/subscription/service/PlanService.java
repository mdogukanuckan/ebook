package com.ebookreader.ebook_backend.modules.subscription.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.subscription.dto.PlanCreateDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.PlanResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import com.ebookreader.ebook_backend.modules.subscription.mapper.PlanMapper;
import com.ebookreader.ebook_backend.modules.subscription.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {
    private final PlanRepository planRepository;
    private final PlanMapper planMapper;

    @Transactional(readOnly = true)
    public List<PlanResponseDTO> getAllPlans() {
        return planRepository.findAll().stream()
                .map(planMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlanResponseDTO createPlan(PlanCreateDTO createDTO) {
        Plan plan = planMapper.toEntity(createDTO);
        Plan savedPlan = planRepository.save(plan);
        return planMapper.toResponse(savedPlan);
    }

    @Transactional
    public PlanResponseDTO updatePlan(Long id, PlanCreateDTO updateDTO) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan bulunamadı ID: " + id));

        plan.setName(updateDTO.getName());
        plan.setDescription(updateDTO.getDescription());
        plan.setPrice(updateDTO.getPrice());
        plan.setDurationDays(updateDTO.getDurationDays());
        plan.setSubscriptionPlan(updateDTO.getSubscriptionPlan());

        Plan updatedPlan = planRepository.save(plan);
        return planMapper.toResponse(updatedPlan);
    }

    @Transactional
    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plan bulunamadı ID: " + id);
        }
        planRepository.deleteById(id);
    }
}

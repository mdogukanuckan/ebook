package com.ebookreader.ebook_backend.modules.subscription.mapper;

import com.ebookreader.ebook_backend.modules.subscription.dto.PlanCreateDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.PlanResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import org.mapstruct.Mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;

@Mapper(componentModel = "spring")
public interface PlanMapper {
    PlanResponseDTO toResponse(Plan plan);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    Plan toEntity(PlanCreateDTO createDTO);
}

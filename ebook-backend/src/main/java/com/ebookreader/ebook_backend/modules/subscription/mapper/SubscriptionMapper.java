package com.ebookreader.ebook_backend.modules.subscription.mapper;

import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    @Mapping(target = "userId",source = "user.id")
    @Mapping(target = "username",source = "user.username")
    SubscriptionResponseDTO toResponse(Subscription subscription);
}

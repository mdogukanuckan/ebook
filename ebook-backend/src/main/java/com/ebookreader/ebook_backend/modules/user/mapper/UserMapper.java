package com.ebookreader.ebook_backend.modules.user.mapper;

import com.ebookreader.ebook_backend.modules.user.dto.RoleResponseDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;

import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "lastLoginDate", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    User toEntity(UserCreateDTO request);

    @Mapping(source = "roles", target = "role")
    UserResponseDTO toResponse(User user);

    RoleResponseDTO toRoleResponse(Role role);

    Set<RoleResponseDTO> toRoleResponseSet(Set<Role> role);

    default String map(Role role) {
        return role.getName();
    }

}

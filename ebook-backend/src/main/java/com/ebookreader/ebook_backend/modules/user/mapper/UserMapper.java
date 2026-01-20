package com.ebookreader.ebook_backend.modules.user.mapper;

import com.ebookreader.ebook_backend.modules.user.dto.RoleResponseDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;

import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;

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
    @Mapping(target = "profilePictureUrl", ignore = true)
    @Mapping(target = "password", expression = "java(passwordEncoder.encode(request.getPassword()))")
    public abstract User toEntity(UserCreateDTO request);

    @Mapping(source = "roles", target = "role")
    public abstract UserResponseDTO toResponse(User user);

    public abstract RoleResponseDTO toRoleResponse(Role role);

    public abstract Set<RoleResponseDTO> toRoleResponseSet(Set<Role> role);

    public String map(Role role) {
        return role.getName();
    }

}

package com.ebookreader.ebook_backend.modules.user.mapper;

import com.ebookreader.ebook_backend.modules.user.dto.RoleResponseDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toResponse(User user);
    RoleResponseDTO toRoleResponse(Role role);
    Set<RoleResponseDTO> toRoleResponseSet(Set<Role> role);
}

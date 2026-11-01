package com.ebookreader.ebook_backend.modules.user.mapper;

import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The API used to name this field "role" while the frontend and /auth/me use "roles",
 * which left the admin user list without any roles.
 */
class UserMapperRolesTest {

    private final UserMapper mapper = new UserMapperImpl();

    @Test
    void mapsRoleNamesIntoTheRolesField() {
        User user = User.builder()
                .username("ali")
                .roles(Set.of(Role.builder().name("ROLE_USER").build(), Role.builder().name("ROLE_ADMIN").build()))
                .build();

        UserResponseDTO dto = mapper.toResponse(user);

        assertThat(dto.getRoles()).containsExactlyInAnyOrder("ROLE_USER", "ROLE_ADMIN");
    }
}

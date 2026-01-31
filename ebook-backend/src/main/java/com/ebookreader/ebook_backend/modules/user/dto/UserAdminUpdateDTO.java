package com.ebookreader.ebook_backend.modules.user.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAdminUpdateDTO {
    private Set<String> roles;
    private Boolean enabled;
}

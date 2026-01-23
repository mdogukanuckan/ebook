package com.ebookreader.ebook_backend.modules.user.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private Long userId;
    private Set<String> roles;
    private String email;
    private String firstName;
    private String lastName;
}

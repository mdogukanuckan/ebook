package com.ebookreader.ebook_backend.modules.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private Long id;
}

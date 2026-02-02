package com.ebookreader.ebook_backend.modules.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponseDTO {

    private Long id;
    private String name;
    private String description;
}
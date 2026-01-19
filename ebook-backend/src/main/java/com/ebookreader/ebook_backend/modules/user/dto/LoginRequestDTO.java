package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRequestDTO {

    @NotBlank(message = "kullanıcı adı giriniz")
    private String username;

    @NotBlank(message = "Şifre giriniz")
    private String password;
}

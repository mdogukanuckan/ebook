package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordChangeDTO {

    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;

    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter uzunluğunda olmalıdır")
    private String newPassword;

    @NotBlank(message = "Şifre tekrarı boş olamaz")
    private String confirmPassword;
}

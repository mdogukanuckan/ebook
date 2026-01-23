package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {

    @NotBlank(message = "İsim alanı boş olamaz")
    private String firstName;

    @NotBlank(message = "Soyisim alanı boş olamaz")
    private String lastName;

    @NotBlank(message = "E-mail boş olamaz")
    @Email(message = "Geçerli bir e-mail adresi giriniz")
    private String email;
}

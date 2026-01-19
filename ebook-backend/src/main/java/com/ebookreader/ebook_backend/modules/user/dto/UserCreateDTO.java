package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateDTO {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    @Size(min = 3,max = 20,message = "Kullanıcı adı 3 ile 20 karakter uzunluğunda olmalıdır")
    private String username;

    @NotBlank(message = "E-mail boş olamaz")
    @Email(message = "Geçerli bir e-mail adresi giriniz")
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 6,message = "Şifre en az 6 karakter uzunluğunda olmalıdır")
    private String passoword;

    @NotBlank(message = "İsim alanı boş olamaz")
    private String firstName;

    @NotBlank(message = "Soyisim alanı boş olamaz")
    private String lastName;
}

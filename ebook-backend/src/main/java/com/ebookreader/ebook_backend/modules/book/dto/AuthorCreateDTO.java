package com.ebookreader.ebook_backend.modules.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AuthorCreateDTO {

    @NotBlank(message = "Yazar adı boş olamaz")
    @Size(min = 2, max = 100, message = "Yazar adı 2-100 karakter arasında olmalıdır")
    private String name;

    @Size(max = 1000, message = "Biyografi en fazla 1000 karakter olabilir")
    private String biography;
}

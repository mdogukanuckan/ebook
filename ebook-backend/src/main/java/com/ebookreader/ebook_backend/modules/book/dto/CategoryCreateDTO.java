package com.ebookreader.ebook_backend.modules.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryCreateDTO {

    @NotBlank(message = "Kategori adı boş olamaz")
    @Size(min = 2, max = 50, message = "Kategori adı 2-50 karakter arasında olmalıdır")
    private String name;

    @Size(max = 255, message = "Açıklama en fazla 255 karakter olabilir")
    private String description;
}
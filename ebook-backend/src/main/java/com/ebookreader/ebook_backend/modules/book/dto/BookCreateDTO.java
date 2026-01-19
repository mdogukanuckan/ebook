package com.ebookreader.ebook_backend.modules.book.dto;

import com.ebookreader.ebook_backend.modules.book.entity.Author;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class BookCreateDTO {

    @NotBlank(message = "Kitap başlığı boş olamaz")
    @Size(min = 1, max = 255, message = "Kitap başlığı 1-255 karakter arasında olmalıdır")
    private String title;

    @NotBlank(message = "Yazar ismi boş olamaz")
    private Author author;

    @NotBlank(message = "ISBN numarası zorunludur")
    private String isbn;

    private String description;

    @Positive(message = "Sayfa sayısı pozitif bir tam sayı olmalıdır")
    private int pageCount;

    @NotNull(message = "Yayınlanma tarihi boş olamaz")
    private LocalDate publishedDate;

    @NotBlank(message = "Kitap dosya yolu (URL) belirtilmelidir")
    private String filePath;
}

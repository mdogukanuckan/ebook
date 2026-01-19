package com.ebookreader.ebook_backend.modules.readingprogress.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgressRequestDTO {

    @NotNull(message = "Kitap id boş olamaz")
    private Long bookId;

    @NotNull(message = "Sayfa sayısı boş olamaz")
    @Min(value = 0,message = "Sayfa sayısı negatif olamaz")
    private Integer currentPage;
}

package com.ebookreader.ebook_backend.modules.book.dto;

import com.ebookreader.ebook_backend.modules.book.entity.Author;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDTO {

    private Long id;
    private String title;
    private Author author;
    private String isbn;
    private String description;
    private int pageCount;
    private LocalDate published;
    private String filePath;
}

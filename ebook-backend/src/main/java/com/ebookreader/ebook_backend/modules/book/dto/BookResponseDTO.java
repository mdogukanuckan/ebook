package com.ebookreader.ebook_backend.modules.book.dto;

import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BookResponseDTO {

    private Long id;
    private String title;
    private Long authorId;
    private String authorName;
    private String isbn;
    private String description;
    private int pageCount;
    private LocalDate published;
    private String filePath;
    private SubscriptionPlan requiredPlan;
    private AuthorResponseDTO author;
    private java.util.Set<CategoryResponseDTO> categories;
}

package com.ebookreader.ebook_backend.modules.book.dto;


import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class BookCreateDTO {

    @NotBlank(message = "Kitap başlığı boş olamaz")
    private String title;


    private Long authorId;


    private AuthorCreateDTO newAuthor;

    @NotNull(message = "En az bir kategori seçilmelidir")
    private Set<Long> categoryIds;

    @NotBlank(message = "ISBN zorunludur")
    private String isbn;
    @Builder.Default
    private SubscriptionPlan requiredPlan = SubscriptionPlan.FREE;

    private String description;
    private int pageCount;
    private LocalDate publishedDate;
    private String fileUrl;
}
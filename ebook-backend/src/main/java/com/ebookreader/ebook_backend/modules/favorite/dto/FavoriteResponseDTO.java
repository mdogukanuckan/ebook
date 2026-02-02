package com.ebookreader.ebook_backend.modules.favorite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponseDTO {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookCoverImage;
    private String authorName;
    private LocalDateTime addedAt;
}

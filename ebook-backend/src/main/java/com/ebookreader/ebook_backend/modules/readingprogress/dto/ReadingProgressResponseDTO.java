package com.ebookreader.ebook_backend.modules.readingprogress.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReadingProgressResponseDTO {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Integer currentPage;
    private Integer totalPage;
    private double progressPercentage;
    private LocalDateTime lastReadAt;
    private boolean isCompleted;

}

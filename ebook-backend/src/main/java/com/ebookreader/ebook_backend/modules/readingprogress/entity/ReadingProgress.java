package com.ebookreader.ebook_backend.modules.readingprogress.entity;

import com.ebookreader.ebook_backend.common.base.BaseEntity;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reading_progress",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id","book_id"})
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReadingProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id",nullable = false)
    private Book book;

    @Column(nullable = false)
    private Integer currentPage;

    private LocalDateTime lastReadAt;

    @Builder.Default
    private boolean isComplete = false;

    public double getProgressPercent(){
        if(book == null || book.getPageCount() == 0) return 0;
        return (double) currentPage/ book.getPageCount() * 100;
    }
}

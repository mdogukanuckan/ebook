package com.ebookreader.ebook_backend.modules.book.entity;

import com.ebookreader.ebook_backend.common.base.BaseEntity;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Book tablosu: Sistemdeki e-kitapları temsil eder.
 */
@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book extends BaseEntity {

    @Column(nullable = false)
    private String title;

    private String author; // Şimdilik String, ileride Author entity'sine çevrilebilir.

    @Column(unique = true)
    private String isbn;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int pageCount;

    private LocalDate publishedDate;

    private String fileUrl; // Kitabın (PDF/EPUB) depolandığı yerin adresi.

    /**
     * @ManyToMany: Kitap ile Kullanıcı arasındaki ilişki.
     * 'mappedBy' kullanımı: İlişkinin sahibi User entity'sidir (user_books tablosu orada tanımlı).
     * Bu sayede veritabanında mükerrer ara tablo oluşması engellenir.
     */
    @ManyToMany(mappedBy = "books")
    @Builder.Default
    private Set<User> users = new HashSet<>();
}
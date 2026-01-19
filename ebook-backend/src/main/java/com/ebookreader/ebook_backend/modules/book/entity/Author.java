package com.ebookreader.ebook_backend.modules.book.entity;

import com.ebookreader.ebook_backend.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Table(name = "authors")
@SQLDelete(sql = "UPDATE authors SET is_deleted = true WHER id=?")
@Where(clause = "is_deleted = false")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Author extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @OneToMany(mappedBy = "author")
    @Builder.Default
    private List<Book> books = new ArrayList<>();
}

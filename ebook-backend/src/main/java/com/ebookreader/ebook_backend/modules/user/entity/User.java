package com.ebookreader.ebook_backend.modules.user.entity;

import com.ebookreader.ebook_backend.common.base.BaseEntity;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity {

        @Column(unique = true, nullable = false)
        private String username;

        @Column(unique = true, nullable = false)
        private String email;

        @Column(nullable = false)
        private String password;

        private String firstName;
        private String lastName;

        @Column(name = "profile_picture_url")
        private String profilePictureUrl;

        @Builder.Default
        private boolean enabled = true;

        @Builder.Default
        private boolean accountNonExpired = true;

        @Builder.Default
        private boolean accountNonLocked = true;

        @Builder.Default
        private boolean credentialsNonExpired = true;

        private LocalDateTime lastLoginDate;

       @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
        @Builder.Default
        private Set<Role> roles = new HashSet<>();

        @ManyToMany
        @JoinTable(name = "user_books", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "book_id"))
        @Builder.Default
        private Set<Book> books = new HashSet<>();
}

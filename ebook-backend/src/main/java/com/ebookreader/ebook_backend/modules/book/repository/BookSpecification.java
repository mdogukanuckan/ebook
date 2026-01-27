package com.ebookreader.ebook_backend.modules.book.repository;

import com.ebookreader.ebook_backend.modules.book.dto.BookSearchRequest;
import com.ebookreader.ebook_backend.modules.book.entity.Author;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.entity.Category;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BookSpecification {

    public static Specification<Book> filterBy(BookSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Text Search (Title, Description, ISBN)
            if (StringUtils.hasText(request.getQuery())) {
                String likePattern = "%" + request.getQuery().toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate descriptionPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")),
                        likePattern);
                Predicate isbnPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), likePattern);

                // OR logic for text search
                predicates.add(criteriaBuilder.or(titlePredicate, descriptionPredicate, isbnPredicate));
            }

            // 2. Filter by Categories
            if (!CollectionUtils.isEmpty(request.getCategoryIds())) {
                Join<Book, Category> categoryJoin = root.join("categories");
                predicates.add(categoryJoin.get("id").in(request.getCategoryIds()));

                // Duplicate results prevention (DISTINCT)
                query.distinct(true);
            }

            // 3. Filter by Authors
            if (!CollectionUtils.isEmpty(request.getAuthorIds())) {
                Join<Book, Author> authorJoin = root.join("author");
                predicates.add(authorJoin.get("id").in(request.getAuthorIds()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

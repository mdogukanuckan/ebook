package com.ebookreader.ebook_backend.modules.readingprogress.repository;

import com.ebookreader.ebook_backend.modules.readingprogress.entity.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {

    Optional<ReadingProgress> findByUserIdAndBookId(Long userId, Long bookId);
    List<ReadingProgress> findByUserId(Long userId);
}

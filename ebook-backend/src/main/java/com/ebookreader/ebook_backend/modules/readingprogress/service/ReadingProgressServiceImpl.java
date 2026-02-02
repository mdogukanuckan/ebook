package com.ebookreader.ebook_backend.modules.readingprogress.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressResponseDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.entity.ReadingProgress;
import com.ebookreader.ebook_backend.modules.readingprogress.repository.ReadingProgressRepository;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReadingProgressServiceImpl implements ReadingProgressService {

    private final ReadingProgressRepository readingProgressRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    @Transactional
    public void startOrUpdateProgress(Long userId, Long bookId) {
        ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    Book book = bookRepository.findById(bookId).orElseThrow();
                    return ReadingProgress.builder()
                            .user(user)
                            .book(book)
                            .currentPage(0)
                            .isCompleted(false)
                            .build();
                });
        progress.setLastReadAt(LocalDateTime.now());
        readingProgressRepository.save(progress);
    }

    @Override
    @Transactional
    public ReadingProgressResponseDTO updatePage(Long userId, ReadingProgressRequestDTO request) {
        ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Okuma kaydı bulunamadı"));
        progress.setCurrentPage(request.getCurrentPage());
        progress.setLastReadAt(LocalDateTime.now());
        if (progress.getCurrentPage() >= progress.getBook().getPageCount()) {
            progress.setCompleted(true);
        }
        ReadingProgress savedProgress = readingProgressRepository.save(progress);

        return mapToResponse(savedProgress);
    }

    @Override
    @Transactional
    public ReadingProgressResponseDTO getProgress(Long userId, Long bookId) {
        ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
                    Book book = bookRepository.findById(bookId)
                            .orElseThrow(() -> new ResourceNotFoundException("Kitap bulunamadı"));

                    return readingProgressRepository.save(ReadingProgress.builder()
                            .user(user)
                            .book(book)
                            .currentPage(0)
                            .isCompleted(false)
                            .lastReadAt(LocalDateTime.now())
                            .build());
                });

        return mapToResponse(progress);
    }

    private ReadingProgressResponseDTO mapToResponse(ReadingProgress progress) {
        return ReadingProgressResponseDTO.builder()
                .id(progress.getId())
                .bookId(progress.getBook().getId())
                .bookTitle(progress.getBook().getTitle())
                .currentPage(progress.getCurrentPage())
                .totalPage(progress.getBook().getPageCount())
                .progressPercentage(progress.getProgressPercentage())
                .lastReadAt(progress.getLastReadAt())
                .isCompleted(progress.isCompleted())
                .build();
    }

    @Override
    public List<ReadingProgressResponseDTO> getUserProgressList(Long userId) {

        return readingProgressRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}

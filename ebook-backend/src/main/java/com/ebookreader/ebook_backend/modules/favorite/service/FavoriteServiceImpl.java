package com.ebookreader.ebook_backend.modules.favorite.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.favorite.dto.FavoriteResponseDTO;
import com.ebookreader.ebook_backend.modules.favorite.entity.Favorite;
import com.ebookreader.ebook_backend.modules.favorite.repository.FavoriteRepository;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    @Transactional
    public void toggleFavorite(Long userId, Long bookId) {
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndBookId(userId, bookId);

        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Kitap bulunamadı"));

            Favorite favorite = Favorite.builder()
                    .user(user)
                    .book(book)
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponseDTO> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long bookId) {
        return favoriteRepository.existsByUserIdAndBookId(userId, bookId);
    }

    private FavoriteResponseDTO mapToResponse(Favorite favorite) {
        return FavoriteResponseDTO.builder()
                .id(favorite.getId())
                .bookId(favorite.getBook().getId())
                .bookTitle(favorite.getBook().getTitle())
                .bookCoverImage(favorite.getBook().getCoverImage())
                .authorName(favorite.getBook().getAuthor().getName())
                .addedAt(favorite.getCreatedAt())
                .build();
    }
}

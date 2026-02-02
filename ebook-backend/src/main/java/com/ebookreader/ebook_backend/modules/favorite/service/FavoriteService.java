package com.ebookreader.ebook_backend.modules.favorite.service;

import com.ebookreader.ebook_backend.modules.favorite.dto.FavoriteResponseDTO;

import java.util.List;

public interface FavoriteService {
    void toggleFavorite(Long userId, Long bookId);

    List<FavoriteResponseDTO> getUserFavorites(Long userId);

    boolean isFavorite(Long userId, Long bookId);
}

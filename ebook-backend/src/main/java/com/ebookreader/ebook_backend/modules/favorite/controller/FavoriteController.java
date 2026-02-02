package com.ebookreader.ebook_backend.modules.favorite.controller;

import com.ebookreader.ebook_backend.modules.favorite.dto.FavoriteResponseDTO;
import com.ebookreader.ebook_backend.modules.favorite.service.FavoriteService;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{bookId}/toggle")
    public ResponseEntity<Void> toggleFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        favoriteService.toggleFavorite(user.getId(), bookId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> getMyFavorites(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(user.getId()));
    }

    @GetMapping("/{bookId}/check")
    public ResponseEntity<Boolean> isFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(favoriteService.isFavorite(user.getId(), bookId));
    }
}

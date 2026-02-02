package com.ebookreader.ebook_backend.modules.readingprogress.controller;

import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressResponseDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.service.ReadingProgressService;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reading-progress")
@RequiredArgsConstructor
@Slf4j
public class ReadingProgressController {
    private final ReadingProgressService readingProgressService;

    @GetMapping("/{bookId}")
    public ResponseEntity<ReadingProgressResponseDTO> getProgress(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(readingProgressService.getProgress(user.getId(), bookId));
    }

    @PostMapping("/update")
    public ResponseEntity<ReadingProgressResponseDTO> updatePage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReadingProgressRequestDTO request) {
        log.info("Okuma ilerlemesi güncelleniyor. User: {}, Book: {}, Page: {}", user.getId(), request.getBookId(),
                request.getCurrentPage());
        return ResponseEntity.ok(readingProgressService.updatePage(user.getId(), request));
    }

    @GetMapping("/my-library")
    public ResponseEntity<List<ReadingProgressResponseDTO>> getMyProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(readingProgressService.getUserProgressList(user.getId()));
    }
}

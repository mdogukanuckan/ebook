package com.ebookreader.ebook_backend.modules.readingprogress.service;

import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressResponseDTO;

import java.util.List;

public interface ReadingProgressService {
    void startOrUpdateProgress(Long userId, Long bookId);

    ReadingProgressResponseDTO updatePage(Long userId, ReadingProgressRequestDTO request);

    ReadingProgressResponseDTO getProgress(Long userId, Long bookId);

    List<ReadingProgressResponseDTO> getUserProgressList(Long userId);
}

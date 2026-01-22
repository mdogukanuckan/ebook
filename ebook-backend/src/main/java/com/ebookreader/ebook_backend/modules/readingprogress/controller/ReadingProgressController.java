package com.ebookreader.ebook_backend.modules.readingprogress.controller;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressResponseDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.service.ReadingProgressService;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import com.ebookreader.ebook_backend.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@Slf4j
public class ReadingProgressController {
    private ReadingProgressService readingProgressService;
    private UserRepository userRepository;

    @PostMapping("/update")
    public ResponseEntity<ReadingProgressResponseDTO> updatePage(@Valid @RequestBody ReadingProgressRequestDTO request){
        Long userId = getCurrentUserId();
        log.info("Okuma ilerlemesi güncelleniyor. User: {}, Book: {}, Page: {}", userId, request.getBookId(), request.getCurrentPage());
        return ResponseEntity.ok(readingProgressService.updatePage(userId,request));
    }

    @GetMapping("/my-library")
    public ResponseEntity<List<ReadingProgressResponseDTO>> getMyProgress(){
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(readingProgressService.getUserProgressList(userId));
    }
    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        return userRepository.findByUsername(username).
                orElseThrow(() -> new BusinessException("Kullanıcı bağlamı bulunamadı"))
                .getId();
    }
}

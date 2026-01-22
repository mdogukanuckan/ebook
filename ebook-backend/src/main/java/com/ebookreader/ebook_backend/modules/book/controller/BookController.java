package com.ebookreader.ebook_backend.modules.book.controller;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.service.BookService;
import com.ebookreader.ebook_backend.modules.book.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.logging.ErrorManager;

/**
 * BookController: Kitap operasyonlarının (CRUD ve Dosya İşlemleri) yönetildiği
 * API katmanı.
 * Mühendislik Notu: @RestController anotasyonu, bu sınıfın Spring Context
 * tarafından
 * taranmasını ve her metodun dönüş değerinin otomatik olarak JSON'a
 * çevrilmesini sağlar.
 */
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final FileStorageService fileStorageService;
    private static final Logger log = LoggerFactory.getLogger(BookController.class);

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponseDTO> createBook(
            @Valid @RequestPart("book") BookCreateDTO request,
            @RequestPart("file") MultipartFile file) {

        return new ResponseEntity<>(bookService.createBook(request, file), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BookResponseDTO>> getBooksByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(bookService.getBooksByAuthor(authorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadBook(@PathVariable Long id, HttpServletRequest request) {
        if (id == null) {
            log.error("Geçersiz indirme isteği: ID null geldi.");
            throw new BusinessException("Geçersiz kitap ID'si!");
        }
        log.info("Kitap indirme işlemi başlatılıyor. Kitap ID: {}", id);

        // getBookById metodu zaten subscription kontrolü yapıyor
        BookResponseDTO book = bookService.getBookById(id);
        Resource resource = fileStorageService.loadFileAsResource(book.getFilePath());
        String contentType = null;

        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            contentType = "application/octet-stream";
            log.error("Dosya okunurken hata oluştu. Kitap ID: {}", id, e);

        } catch (Exception ex) {
            log.error("Beklenmedik bir hata oluştu. Kitap ID: {}", id, ex);
            throw ex;
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewBook(@PathVariable("id") Long id, HttpServletRequest request) {
        log.info("Kitap görüntüleme/okuma isteği alındı. ID: {}", id);

        // getBookById metodu zaten subscription kontrolü yapıyor
        BookResponseDTO book = bookService.getBookById(id);
        Resource resource = fileStorageService.loadFileAsResource(book.getFilePath());

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            contentType = "application/octet-stream";
        }

        // TODO: Burada ileride 'ReadingProgress' servisini çağırarak
        // "Kullanıcı bu kitabı açtı, okuma tarihini güncelle" diyeceğiz.

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
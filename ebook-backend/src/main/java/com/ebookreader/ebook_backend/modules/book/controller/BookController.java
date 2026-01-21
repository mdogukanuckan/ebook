package com.ebookreader.ebook_backend.modules.book.controller;

import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * BookController: Kitap operasyonlarının (CRUD ve Dosya İşlemleri) yönetildiği API katmanı.
 * Mühendislik Notu: @RestController anotasyonu, bu sınıfın Spring Context tarafından
 * taranmasını ve her metodun dönüş değerinin otomatik olarak JSON'a çevrilmesini sağlar.
 */
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;


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
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
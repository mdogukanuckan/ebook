package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import com.ebookreader.ebook_backend.modules.book.dto.BookSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BookService {
    Page<BookResponseDTO> searchBooks(BookSearchRequest request, Pageable pageable);

    BookResponseDTO getBookById(Long id);

    BookResponseDTO createBook(BookCreateDTO request, MultipartFile file, MultipartFile coverImage);

    List<BookResponseDTO> getAllBooks();

    List<BookResponseDTO> getBooksByAuthor(Long authorId);

    BookResponseDTO updateBook(Long id, BookCreateDTO request, MultipartFile file, MultipartFile coverImage);

    void deleteBook(Long id);
}
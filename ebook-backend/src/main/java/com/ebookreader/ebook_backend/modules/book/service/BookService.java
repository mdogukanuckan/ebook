package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
    BookResponseDTO getBookById(Long id);

    BookResponseDTO createBook(BookCreateDTO request, MultipartFile file);

    List<BookResponseDTO> getAllBooks();
    List<BookResponseDTO> getBooksByAuthor(Long authorId);
    void deleteBook(Long id);
}
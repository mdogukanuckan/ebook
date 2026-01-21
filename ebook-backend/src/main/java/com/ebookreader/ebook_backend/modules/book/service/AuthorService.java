package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.modules.book.dto.AuthorCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.AuthorResponseDTO;

import java.util.List;

public interface AuthorService {
    AuthorResponseDTO createAuthor(AuthorCreateDTO request);
    AuthorResponseDTO getAuthorById(Long id);
    List<AuthorResponseDTO> getAllAuthors();
    AuthorResponseDTO updateAuthor(Long id, AuthorCreateDTO request);
    void deleteAuthor(Long id);
}
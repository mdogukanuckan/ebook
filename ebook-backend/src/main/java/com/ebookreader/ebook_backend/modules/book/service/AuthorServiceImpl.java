package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.dto.AuthorCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.AuthorResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Author;
import com.ebookreader.ebook_backend.modules.book.mapper.AuthorMapper;
import com.ebookreader.ebook_backend.modules.book.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    @Override
    public AuthorResponseDTO createAuthor(AuthorCreateDTO request) {
        Author author = authorMapper.toEntity(request);
        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorResponseDTO getAuthorById(Long id) {
        return authorRepository.findById(id)
                .map(authorMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Yazar bulunamadı: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuthorResponseDTO> getAllAuthors() {
        return authorMapper.toResponseList(authorRepository.findAll());
    }

    @Override
    public AuthorResponseDTO updateAuthor(Long id, AuthorCreateDTO request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Güncellenecek yazar bulunamadı"));

        author.setName(request.getName());
        author.setBiography(request.getBiography());

        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Override
    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Silinecek yazar bulunamadı");
        }
        authorRepository.deleteById(id);
    }
}

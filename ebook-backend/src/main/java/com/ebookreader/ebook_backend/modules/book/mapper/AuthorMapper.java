package com.ebookreader.ebook_backend.modules.book.mapper;

import com.ebookreader.ebook_backend.modules.book.dto.AuthorCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.AuthorResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Author toEntity(AuthorCreateDTO request);

    AuthorResponseDTO toResponse(Author author);

    List<AuthorResponseDTO> toResponseList(List<Author> authors);
}
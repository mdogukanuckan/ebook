package com.ebookreader.ebook_backend.modules.book.mapper;

import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { AuthorMapper.class, CategoryMapper.class })
public interface BookMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Book toEntity(BookCreateDTO request);

    @Mapping(target = "authorName", source = "author.name")
    @Mapping(target = "authorId", source = "author.id")
    @Mapping(target = "filePath", source = "fileUrl")
    @Mapping(target = "author", source = "author")
    @Mapping(target = "categories", source = "categories")
    BookResponseDTO toResponse(Book book);

}

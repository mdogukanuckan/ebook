package com.ebookreader.ebook_backend.modules.book.mapper;

import com.ebookreader.ebook_backend.modules.book.dto.CategoryCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.CategoryResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Category toEntity(CategoryCreateDTO request);

    CategoryResponseDTO toResponse(Category category);

    List<CategoryResponseDTO> toResponseList(List<Category> categories);
}
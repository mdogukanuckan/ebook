package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.modules.book.dto.CategoryCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryCreateDTO request);
    CategoryResponseDTO getCategoryById(Long id);
    List<CategoryResponseDTO> getAllCategories();
    CategoryResponseDTO updateCategory(Long id, CategoryCreateDTO request);
    void deleteCategory(Long id);
}
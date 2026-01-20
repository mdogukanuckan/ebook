package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.dto.CategoryCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.CategoryResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Category;
import com.ebookreader.ebook_backend.modules.book.mapper.CategoryMapper;
import com.ebookreader.ebook_backend.modules.book.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional // Veritabanı tutarlılığı için tüm metodlar transaction kapsamındadır.
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponseDTO createCategory(CategoryCreateDTO request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BusinessException("Bu kategori adı zaten mevcut: " + request.getName());
        }

        Category category = categoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDTO getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı! ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toResponseList(categories);
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryCreateDTO request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Güncellenecek kategori bulunamadı!"));

        if (!existingCategory.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new BusinessException("Bu isimde başka bir kategori zaten var.");
        }

        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());

        return categoryMapper.toResponse(categoryRepository.save(existingCategory));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Silinecek kategori bulunamadı!");
        }
        categoryRepository.deleteById(id);
    }
}
package com.ebookreader.ebook_backend.modules.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSearchRequest {

    private String query;

    private List<Long> categoryIds; 
    private List<Long> authorIds; 

    private String sort;
}

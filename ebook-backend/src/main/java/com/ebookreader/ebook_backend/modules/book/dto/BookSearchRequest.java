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

    // Genel arama (Kitap adı, ISBN veya açıklama içinde)
    private String query;

    // Filtreler
    private List<Long> categoryIds; // Birden fazla kategori seçimi için
    private List<Long> authorIds; // Birden fazla yazar seçimi için

    // Sıralama (Opsiyonel, Pageable.sort da kullanılabilir ama özel logic için
    // buraya eklenebilir)
    // Örnek: "price_asc", "date_desc" vs.
    private String sort;
}

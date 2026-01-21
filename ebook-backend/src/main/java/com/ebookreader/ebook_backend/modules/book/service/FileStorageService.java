package com.ebookreader.ebook_backend.modules.book.service;

import org.springframework.web.multipart.MultipartFile;


public interface FileStorageService {
    String storeFile(MultipartFile file, String subDirectory);
    void deleteFile(String filePath);
}
package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;


    public LocalFileStorageServiceImpl(@Value("${application.file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new BusinessException("Dosyaların saklanacağı dizin oluşturulamadı!");
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new BusinessException("Geçersiz dosya yolu formatı!");
            }

            String extension = fileName.substring(fileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            Path targetLocation = this.fileStorageLocation.resolve(subDirectory).resolve(uniqueFileName);
            Files.createDirectories(targetLocation.getParent());

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return subDirectory + "/" + uniqueFileName;

        } catch (IOException ex) {
            throw new BusinessException("Dosya kaydedilirken bir hata oluştu: " + fileName);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path targetPath = this.fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(targetPath);
        } catch (IOException ex) {
        }
    }
}
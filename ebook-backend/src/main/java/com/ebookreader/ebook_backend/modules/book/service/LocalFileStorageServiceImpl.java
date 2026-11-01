package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    // Extensions accepted per target directory; the real content is also checked against the extension.
    private static final Map<String, Set<String>> ALLOWED_EXTENSIONS = Map.of(
            "books", Set.of(".pdf"),
            "covers", Set.of(".jpg", ".jpeg", ".png", ".webp"));

    private static final int SIGNATURE_LENGTH = 12;

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
        Set<String> allowedExtensions = ALLOWED_EXTENSIONS.get(subDirectory);
        if (allowedExtensions == null) {
            throw new BusinessException("Geçersiz dosya dizini!");
        }
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Boş dosya yüklenemez!");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new BusinessException("Dosya adı okunamadı!");
        }
        String fileName = StringUtils.cleanPath(originalName);
        if (fileName.contains("..")) {
            throw new BusinessException("Geçersiz dosya yolu formatı!");
        }

        String extension = extensionOf(fileName);
        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException("Desteklenmeyen dosya türü. İzin verilenler: " + String.join(", ", allowedExtensions));
        }

        try {
            if (!hasExpectedSignature(file, extension)) {
                throw new BusinessException("Dosya içeriği uzantısıyla uyuşmuyor!");
            }

            Path targetLocation = resolveInsideStorage(subDirectory + "/" + UUID.randomUUID() + extension);
            Files.createDirectories(targetLocation.getParent());
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return subDirectory + "/" + targetLocation.getFileName();
        } catch (IOException ex) {
            log.error("Dosya kaydedilemedi: {}", fileName, ex);
            throw new BusinessException("Dosya kaydedilirken bir hata oluştu: " + fileName);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        if (!StringUtils.hasText(filePath)) {
            return;
        }
        try {
            Files.deleteIfExists(resolveInsideStorage(filePath));
        } catch (IOException | BusinessException ex) {
            log.warn("Dosya silinemedi: {}", filePath, ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String filePath) {
        try {
            Path path = resolveInsideStorage(filePath);
            if (!Files.isRegularFile(path) || !Files.isReadable(path)) {
                throw new ResourceNotFoundException("Dosya bulunamadı veya okunamaz durumda: " + filePath);
            }
            return new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Dosya yolu geçersiz: " + filePath);
        } catch (BusinessException e) {
            throw new ResourceNotFoundException("Dosya bulunamadı: " + filePath);
        }
    }

    private Path resolveInsideStorage(String relativePath) {
        Path target = fileStorageLocation.resolve(relativePath).normalize();
        if (!target.startsWith(fileStorageLocation)) {
            throw new BusinessException("Geçersiz dosya yolu!");
        }
        return target;
    }

    private static String extensionOf(String fileName) {
        int dot = fileName.lastIndexOf('.');
        return dot < 0 ? "" : fileName.substring(dot).toLowerCase(Locale.ROOT);
    }

    private static boolean hasExpectedSignature(MultipartFile file, String extension) throws IOException {
        byte[] head;
        try (InputStream in = file.getInputStream()) {
            head = in.readNBytes(SIGNATURE_LENGTH);
        }
        return switch (extension) {
            case ".pdf" -> startsWith(head, "%PDF-".getBytes(StandardCharsets.US_ASCII));
            case ".jpg", ".jpeg" -> startsWith(head, new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF });
            case ".png" -> startsWith(head, new byte[] { (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A });
            case ".webp" -> head.length >= SIGNATURE_LENGTH
                    && startsWith(head, "RIFF".getBytes(StandardCharsets.US_ASCII))
                    && Arrays.equals(Arrays.copyOfRange(head, 8, 12), "WEBP".getBytes(StandardCharsets.US_ASCII));
            default -> false;
        };
    }

    private static boolean startsWith(byte[] data, byte[] prefix) {
        return data.length >= prefix.length && Arrays.equals(Arrays.copyOf(data, prefix.length), prefix);
    }
}

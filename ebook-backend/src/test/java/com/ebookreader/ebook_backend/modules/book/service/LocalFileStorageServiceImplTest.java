package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LocalFileStorageServiceImplTest {

    private static final byte[] PDF = "%PDF-1.4 sample".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] PNG = { (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0 };
    private static final byte[] JPEG = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0 };
    private static final byte[] WEBP = "RIFF\0\0\0\0WEBPVP8 ".getBytes(StandardCharsets.ISO_8859_1);

    @TempDir
    Path root;

    private LocalFileStorageServiceImpl storage;

    @BeforeEach
    void setUp() {
        storage = new LocalFileStorageServiceImpl(root.toString());
    }

    private static MockMultipartFile upload(String name, byte[] content) {
        return new MockMultipartFile("file", name, "application/octet-stream", content);
    }

    @Test
    void storesPdfUnderBooksWithGeneratedName() throws IOException {
        String stored = storage.storeFile(upload("My Book.PDF", PDF), "books");

        assertThat(stored).startsWith("books/").endsWith(".pdf").doesNotContain("My Book");
        assertThat(Files.readAllBytes(root.resolve(stored))).isEqualTo(PDF);
    }

    @Test
    void storesPngJpegAndWebpCovers() {
        assertThat(storage.storeFile(upload("a.png", PNG), "covers")).endsWith(".png");
        assertThat(storage.storeFile(upload("a.jpg", JPEG), "covers")).endsWith(".jpg");
        assertThat(storage.storeFile(upload("a.webp", WEBP), "covers")).endsWith(".webp");
    }

    @Test
    void rejectsFileWithoutExtension() {
        assertThatThrownBy(() -> storage.storeFile(upload("noextension", PDF), "books"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void rejectsDisallowedExtensionsForTheDirectory() {
        assertThatThrownBy(() -> storage.storeFile(upload("run.exe", PDF), "books"))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> storage.storeFile(upload("cover.pdf", PDF), "covers"))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> storage.storeFile(upload("book.png", PNG), "books"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void rejectsContentThatDoesNotMatchTheExtension() {
        assertThatThrownBy(() -> storage.storeFile(upload("fake.pdf", "<html>not a pdf</html>".getBytes()), "books"))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> storage.storeFile(upload("fake.png", PDF), "covers"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void rejectsEmptyFilesAndUnknownDirectories() {
        assertThatThrownBy(() -> storage.storeFile(upload("empty.pdf", new byte[0]), "books"))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> storage.storeFile(upload("a.pdf", PDF), "../escape"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void rejectsPathTraversalInFileName() {
        assertThatThrownBy(() -> storage.storeFile(upload("../../evil.pdf", PDF), "books"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void loadsStoredFileAndRejectsMissingOnes() {
        String stored = storage.storeFile(upload("a.pdf", PDF), "books");

        assertThat(storage.loadFileAsResource(stored).exists()).isTrue();
        assertThatThrownBy(() -> storage.loadFileAsResource("books/missing.pdf"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void doesNotServeDirectoriesOrFilesOutsideTheStorageRoot() throws IOException {
        Files.writeString(root.getParent().resolve("outside.txt"), "secret");

        assertThatThrownBy(() -> storage.loadFileAsResource("../outside.txt"))
                .isInstanceOf(ResourceNotFoundException.class);
        assertThatThrownBy(() -> storage.loadFileAsResource("covers/.."))
                .isInstanceOf(ResourceNotFoundException.class);
        assertThatThrownBy(() -> storage.loadFileAsResource("books"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRemovesOnlyFilesInsideTheStorageRoot() throws IOException {
        String stored = storage.storeFile(upload("a.pdf", PDF), "books");
        Path outside = Files.writeString(root.getParent().resolve("keep.txt"), "keep");

        storage.deleteFile(stored);
        storage.deleteFile("../keep.txt");

        assertThat(root.resolve(stored)).doesNotExist();
        assertThat(outside).exists();
    }

    @Test
    void deleteIgnoresNullBlankAndMissingPaths() {
        assertThatCode(() -> {
            storage.deleteFile(null);
            storage.deleteFile("  ");
            storage.deleteFile("books/never-existed.pdf");
        }).doesNotThrowAnyException();
    }
}

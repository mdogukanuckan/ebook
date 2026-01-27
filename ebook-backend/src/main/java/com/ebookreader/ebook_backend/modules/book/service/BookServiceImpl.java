package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.dto.BookCreateDTO;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Author;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.entity.Category;
import com.ebookreader.ebook_backend.modules.book.mapper.AuthorMapper;
import com.ebookreader.ebook_backend.modules.book.mapper.BookMapper;
import com.ebookreader.ebook_backend.modules.book.repository.AuthorRepository;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.book.repository.CategoryRepository;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import com.ebookreader.ebook_backend.modules.book.dto.BookSearchRequest;
import com.ebookreader.ebook_backend.modules.book.repository.BookSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;
    private final AuthorMapper authorMapper;
    private final FileStorageService fileStorageService;
    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @Override
    public Page<BookResponseDTO> searchBooks(BookSearchRequest request, Pageable pageable) {
        log.info("Kitap arama isteği: {}", request);
        Specification<Book> spec = BookSpecification.filterBy(request);
        Page<Book> books = bookRepository.findAll(spec, pageable);
        return books.map(bookMapper::toResponse);
    }

    @Override
    public BookResponseDTO createBook(BookCreateDTO request, MultipartFile file) {
        log.info("Kitap oluşturma işlemi başladı: {}", request.getTitle());

        Author author = resolveAuthor(request);

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new BusinessException("Seçilen kategorilerden bazıları veritabanında bulunamadı!");
        }

        String filePath;
        try {
            filePath = fileStorageService.storeFile(file, "books");
            log.info("Dosya başarıyla yüklendi: {}", filePath);
        } catch (Exception e) {
            log.error("Dosya yükleme hatası!", e);
            throw new BusinessException("Dosya sisteme kaydedilemedi: " + e.getMessage());
        }

        // 4. Kitap Nesnesini İnşa Et
        Book book = bookMapper.toEntity(request);
        book.setAuthor(author);
        book.setCategories(new HashSet<>(categories));
        book.setFileUrl(filePath);

        try {
            Book savedBook = bookRepository.saveAndFlush(book);
            log.info("Kitap veritabanına kaydedildi, ID: {}", savedBook.getId());
            return bookMapper.toResponse(savedBook);
        } catch (Exception e) {
            log.error("Veritabanı kayıt hatası!", e);
            fileStorageService.deleteFile(filePath); // Kayıt başarısızsa dosyayı geri sil
            throw new BusinessException("Kitap kaydedilirken veritabanı hatası oluştu: " + e.getMessage());
        }
    }

    private Author resolveAuthor(BookCreateDTO request) {
        if (request.getAuthorId() != null) {
            return authorRepository.findById(request.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Yazar bulunamadı! ID: " + request.getAuthorId()));
        } else if (request.getNewAuthor() != null) {
            return authorRepository.save(authorMapper.toEntity(request.getNewAuthor()));
        }
        throw new BusinessException("Geçerli bir yazar seçilmedi!");
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> getAllBooks() {
        Long currentUserId = getCurrentUserId();

        return bookRepository.findAll().stream()
                .filter(book -> {
                    // Kullanıcının bu kitaba erişimi var mı kontrol et
                    boolean canAccess = subscriptionService.canAccessBook(currentUserId, book.getId());
                    log.debug("Kullanıcı {} için kitap {} erişim durumu: {}",
                            currentUserId, book.getId(), canAccess);
                    return canAccess;
                })
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDTO getBookById(Long id) {
        Long currentUserId = getCurrentUserId();

        // Kullanıcının bu kitaba erişimi var mı kontrol et
        if (!subscriptionService.canAccessBook(currentUserId, id)) {
            throw new BusinessException("Bu kitaba erişim yetkiniz yok! Lütfen aboneliğinizi yükseltin.");
        }

        return bookRepository.findById(id).map(bookMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Kitap bulunamadı!"));
    }

    @Override
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Kitap bulunamadı!"));
        fileStorageService.deleteFile(book.getFileUrl());
        bookRepository.delete(book);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> getBooksByAuthor(Long authorId) {
        Long currentUserId = getCurrentUserId();

        return bookRepository.findByAuthorId(authorId).stream()
                .filter(book -> subscriptionService.canAccessBook(currentUserId, book.getId()))
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Şu anda giriş yapmış kullanıcının ID'sini döndürür
     */
    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                : principal.toString();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Kullanıcı bağlamı bulunamadı!"));

        return user.getId();
    }
}
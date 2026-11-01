package com.ebookreader.ebook_backend.modules.book.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.mapper.AuthorMapper;
import com.ebookreader.ebook_backend.modules.book.mapper.BookMapper;
import com.ebookreader.ebook_backend.modules.book.repository.AuthorRepository;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.book.repository.CategoryRepository;
import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Book metadata must stay readable for any signed-in user (so a locked book can show its upsell page);
 * only the file endpoints are gated. This used to be enforced here without an admin exception, which
 * locked admins out of books above their own plan.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceImplGetByIdTest {

    private static final long BOOK_ID = 4L;

    @Mock
    private BookRepository bookRepository;
    @Mock
    private AuthorRepository authorRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private BookMapper bookMapper;
    @Mock
    private AuthorMapper authorMapper;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private SubscriptionService subscriptionService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookServiceImpl service;

    @Test
    void returnsMetadataOfAPremiumBookWithoutCheckingTheSubscription() {
        Book book = Book.builder().title("VIP kitap").requiredPlan(SubscriptionPlan.VIP).build();
        BookResponseDTO dto = BookResponseDTO.builder().id(BOOK_ID).title("VIP kitap").requiredPlan(SubscriptionPlan.VIP).build();
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(book));
        when(bookMapper.toResponse(book)).thenReturn(dto);

        assertThat(service.getBookById(BOOK_ID)).isSameAs(dto);
        verifyNoInteractions(subscriptionService);
    }

    @Test
    void unknownBook_throwsNotFound() {
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getBookById(BOOK_ID)).isInstanceOf(ResourceNotFoundException.class);
    }
}

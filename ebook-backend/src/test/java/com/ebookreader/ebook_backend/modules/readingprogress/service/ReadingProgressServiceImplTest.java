package com.ebookreader.ebook_backend.modules.readingprogress.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressResponseDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.entity.ReadingProgress;
import com.ebookreader.ebook_backend.modules.readingprogress.repository.ReadingProgressRepository;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReadingProgressServiceImplTest {

    private static final long USER_ID = 10L;
    private static final long OTHER_USER_ID = 20L;
    private static final long BOOK_ID = 5L;
    private static final int PAGE_COUNT = 100;

    @Mock
    private ReadingProgressRepository readingProgressRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private ReadingProgressServiceImpl service;

    private static Book book() {
        Book book = Book.builder().title("Kitap").pageCount(PAGE_COUNT).build();
        book.setId(BOOK_ID);
        return book;
    }

    private static ReadingProgress progress(int currentPage) {
        return ReadingProgress.builder().book(book()).currentPage(currentPage).build();
    }

    private static ReadingProgressRequestDTO request(int page) {
        return ReadingProgressRequestDTO.builder().bookId(BOOK_ID).currentPage(page).build();
    }

    @Test
    void updatePage_updatesOnlyCallersOwnRecord() {
        ReadingProgress own = progress(1);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));
        when(readingProgressRepository.save(own)).thenReturn(own);

        ReadingProgressResponseDTO response = service.updatePage(USER_ID, request(40));

        assertThat(response.getCurrentPage()).isEqualTo(40);
        verify(readingProgressRepository).findByUserIdAndBookId(USER_ID, BOOK_ID);
        verify(readingProgressRepository, never()).findByUserIdAndBookId(OTHER_USER_ID, BOOK_ID);
    }

    @Test
    void updatePage_whenCallerHasNoRecord_doesNotTouchAnotherUsersRecord() {
        ReadingProgress othersProgress = progress(7);
        lenient().when(readingProgressRepository.findByUserIdAndBookId(OTHER_USER_ID, BOOK_ID))
                .thenReturn(Optional.of(othersProgress));
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updatePage(USER_ID, request(40)))
                .isInstanceOf(ResourceNotFoundException.class);

        assertThat(othersProgress.getCurrentPage()).isEqualTo(7);
        verify(readingProgressRepository, never()).save(any());
    }

    @Test
    void updatePage_reachingLastPage_marksCompleted() {
        ReadingProgress own = progress(1);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));
        when(readingProgressRepository.save(own)).thenReturn(own);

        ReadingProgressResponseDTO response = service.updatePage(USER_ID, request(PAGE_COUNT));

        assertThat(response.isCompleted()).isTrue();
    }

    @Test
    void updatePage_beyondPageCount_isClampedToLastPage() {
        ReadingProgress own = progress(1);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));
        when(readingProgressRepository.save(own)).thenReturn(own);

        ReadingProgressResponseDTO response = service.updatePage(USER_ID, request(PAGE_COUNT + 50));

        assertThat(response.getCurrentPage()).isEqualTo(PAGE_COUNT);
        assertThat(response.isCompleted()).isTrue();
    }

    @Test
    void updatePage_goingBackFromLastPage_clearsCompleted() {
        ReadingProgress own = progress(PAGE_COUNT);
        own.setCompleted(true);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));
        when(readingProgressRepository.save(own)).thenReturn(own);

        ReadingProgressResponseDTO response = service.updatePage(USER_ID, request(10));

        assertThat(response.isCompleted()).isFalse();
    }

    @Test
    void startOrUpdateProgress_unknownBook_throwsNotFoundInsteadOfNoSuchElement() {
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(User.builder().build()));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.startOrUpdateProgress(USER_ID, BOOK_ID))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getProgress_whenExisting_returnsCallersRecordWithoutCreatingNewOne() {
        ReadingProgress own = progress(12);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));

        ReadingProgressResponseDTO response = service.getProgress(USER_ID, BOOK_ID);

        assertThat(response.getCurrentPage()).isEqualTo(12);
        verify(readingProgressRepository, never()).save(any());
    }

    @Test
    void getProgress_whenMissing_createsRecordForCallerNotForAnotherUser() {
        User caller = User.builder().username("ali").build();
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(caller));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(book()));
        when(readingProgressRepository.save(any(ReadingProgress.class))).thenAnswer(inv -> inv.getArgument(0));

        ReadingProgressResponseDTO response = service.getProgress(USER_ID, BOOK_ID);

        ArgumentCaptor<ReadingProgress> captor = ArgumentCaptor.forClass(ReadingProgress.class);
        verify(readingProgressRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isSameAs(caller);
        assertThat(response.getCurrentPage()).isZero();
        verify(userRepository, never()).findById(OTHER_USER_ID);
    }

    @Test
    void getProgress_unknownBook_throwsNotFoundAndSavesNothing() {
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(User.builder().build()));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getProgress(USER_ID, BOOK_ID))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(readingProgressRepository, never()).save(any());
    }

    @Test
    void getUserProgressList_queriesOnlyByGivenUserId() {
        when(readingProgressRepository.findByUserId(USER_ID)).thenReturn(List.of(progress(3)));

        List<ReadingProgressResponseDTO> result = service.getUserProgressList(USER_ID);

        assertThat(result).hasSize(1);
        verify(readingProgressRepository).findByUserId(USER_ID);
        verify(readingProgressRepository, never()).findAll();
        verify(readingProgressRepository, never()).findByUserId(OTHER_USER_ID);
    }

    @Test
    void startOrUpdateProgress_onlyTouchesCallersRecord() {
        ReadingProgress own = progress(4);
        when(readingProgressRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(own));

        service.startOrUpdateProgress(USER_ID, BOOK_ID);

        verify(readingProgressRepository).save(own);
        assertThat(own.getLastReadAt()).isNotNull();
        verify(readingProgressRepository, never()).findByUserIdAndBookId(OTHER_USER_ID, BOOK_ID);
    }
}

package com.ebookreader.ebook_backend.modules.favorite.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Author;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.favorite.dto.FavoriteResponseDTO;
import com.ebookreader.ebook_backend.modules.favorite.entity.Favorite;
import com.ebookreader.ebook_backend.modules.favorite.repository.FavoriteRepository;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceImplTest {

    private static final long USER_ID = 10L;
    private static final long OTHER_USER_ID = 20L;
    private static final long BOOK_ID = 5L;

    @Mock
    private FavoriteRepository favoriteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private FavoriteServiceImpl service;

    private static Book book() {
        Book book = Book.builder()
                .title("Kitap")
                .coverImage("covers/a.png")
                .author(Author.builder().name("Yazar").build())
                .build();
        book.setId(BOOK_ID);
        return book;
    }

    @Test
    void toggle_whenNotFavorite_createsFavoriteForRequestingUserOnly() {
        User user = User.builder().username("ali").build();
        when(favoriteRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(book()));

        service.toggleFavorite(USER_ID, BOOK_ID);

        ArgumentCaptor<Favorite> captor = ArgumentCaptor.forClass(Favorite.class);
        verify(favoriteRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isSameAs(user);
        assertThat(captor.getValue().getBook().getId()).isEqualTo(BOOK_ID);
    }

    @Test
    void toggle_whenAlreadyFavorite_removesOnlyThatUsersFavorite() {
        Favorite existing = Favorite.builder().build();
        when(favoriteRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.of(existing));

        service.toggleFavorite(USER_ID, BOOK_ID);

        verify(favoriteRepository).delete(existing);
        verify(favoriteRepository, never()).save(any());
        verify(favoriteRepository, never()).findByUserIdAndBookId(OTHER_USER_ID, BOOK_ID);
    }

    @Test
    void toggle_otherUsersFavoriteOfSameBook_doesNotAffectCaller() {
        // Başka kullanıcı aynı kitabı favorilemiş; çağıranın sorgusu boş dönmeli ve yeni kayıt oluşmalı.
        when(favoriteRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(User.builder().build()));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(book()));

        service.toggleFavorite(USER_ID, BOOK_ID);

        verify(favoriteRepository, never()).delete(any());
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void toggle_unknownBook_throwsNotFoundAndSavesNothing() {
        when(favoriteRepository.findByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(User.builder().build()));
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.toggleFavorite(USER_ID, BOOK_ID))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void getUserFavorites_queriesOnlyByGivenUserId() {
        Favorite favorite = Favorite.builder().book(book()).build();
        when(favoriteRepository.findByUserId(USER_ID)).thenReturn(List.of(favorite));

        List<FavoriteResponseDTO> result = service.getUserFavorites(USER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBookId()).isEqualTo(BOOK_ID);
        verify(favoriteRepository).findByUserId(USER_ID);
        verify(favoriteRepository, never()).findAll();
        verify(favoriteRepository, never()).findByUserId(OTHER_USER_ID);
    }

    @Test
    void getUserFavorites_whenUserHasNone_returnsEmptyEvenIfOthersHave() {
        when(favoriteRepository.findByUserId(USER_ID)).thenReturn(List.of());

        assertThat(service.getUserFavorites(USER_ID)).isEmpty();
        verify(favoriteRepository, never()).findAll();
    }

    @Test
    void isFavorite_checksOnlyGivenUsersRecord() {
        when(favoriteRepository.existsByUserIdAndBookId(USER_ID, BOOK_ID)).thenReturn(false);
        when(favoriteRepository.existsByUserIdAndBookId(OTHER_USER_ID, BOOK_ID)).thenReturn(true);

        assertThat(service.isFavorite(USER_ID, BOOK_ID)).isFalse();
        assertThat(service.isFavorite(OTHER_USER_ID, BOOK_ID)).isTrue();
        verify(favoriteRepository, never()).delete(any());
        verify(favoriteRepository, never()).deleteById(anyLong());
    }
}

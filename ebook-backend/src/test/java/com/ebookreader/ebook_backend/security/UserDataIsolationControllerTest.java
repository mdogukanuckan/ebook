package com.ebookreader.ebook_backend.security;

import com.ebookreader.ebook_backend.config.SecurityConfig;
import com.ebookreader.ebook_backend.modules.favorite.controller.FavoriteController;
import com.ebookreader.ebook_backend.modules.favorite.service.FavoriteService;
import com.ebookreader.ebook_backend.modules.readingprogress.controller.ReadingProgressController;
import com.ebookreader.ebook_backend.modules.readingprogress.dto.ReadingProgressRequestDTO;
import com.ebookreader.ebook_backend.modules.readingprogress.service.ReadingProgressService;
import com.ebookreader.ebook_backend.modules.subscription.controller.SubscriptionController;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.subscription.controller.SubscriptionController;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Favori ve okuma ilerlemesi uçlarında kullanıcı kimliğinin yalnızca oturumdan
 * geldiğini, istekle taşınan başka bir userId'nin yok sayıldığını doğrular.
 */
@WebMvcTest(controllers = { FavoriteController.class, ReadingProgressController.class, SubscriptionController.class })
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
class UserDataIsolationControllerTest {

    private static final long SESSION_USER_ID = 10L;
    private static final long FOREIGN_USER_ID = 999L;
    private static final long BOOK_ID = 5L;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FavoriteService favoriteService;
    @MockitoBean
    private ReadingProgressService readingProgressService;
    @MockitoBean
    private SubscriptionService subscriptionService;
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private static RequestPostProcessor sessionUser() {
        User user = User.builder()
                .username("ali")
                .email("ali@test.com")
                .password("x")
                .roles(Set.of(Role.builder().name("ROLE_USER").build()))
                .build();
        user.setId(SESSION_USER_ID);
        return authentication(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    // ---- Favoriler ----

    @Test
    void toggleFavorite_usesSessionUserId_ignoringForeignUserIdParameter() throws Exception {
        mockMvc.perform(post("/api/v1/favorites/" + BOOK_ID + "/toggle")
                .param("userId", String.valueOf(FOREIGN_USER_ID))
                .with(sessionUser()))
                .andExpect(status().isOk());

        verify(favoriteService).toggleFavorite(SESSION_USER_ID, BOOK_ID);
    }

    @Test
    void getMyFavorites_usesSessionUserId_ignoringForeignUserIdParameter() throws Exception {
        when(favoriteService.getUserFavorites(SESSION_USER_ID)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/favorites")
                .param("userId", String.valueOf(FOREIGN_USER_ID))
                .with(sessionUser()))
                .andExpect(status().isOk());

        verify(favoriteService).getUserFavorites(SESSION_USER_ID);
    }

    @Test
    void isFavorite_usesSessionUserId_ignoringForeignUserIdParameter() throws Exception {
        when(favoriteService.isFavorite(SESSION_USER_ID, BOOK_ID)).thenReturn(true);

        mockMvc.perform(get("/api/v1/favorites/" + BOOK_ID + "/check")
                .param("userId", String.valueOf(FOREIGN_USER_ID))
                .with(sessionUser()))
                .andExpect(status().isOk());

        verify(favoriteService).isFavorite(SESSION_USER_ID, BOOK_ID);
    }

    @Test
    void favorites_anonymous_isUnauthorizedAndServiceUntouched() throws Exception {
        mockMvc.perform(get("/api/v1/favorites")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/favorites/" + BOOK_ID + "/toggle")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/favorites/" + BOOK_ID + "/check")).andExpect(status().isUnauthorized());

        verifyNoInteractions(favoriteService);
    }

    // ---- Abonelik ----

    @Test
    void subscribe_usesSessionUserId_ignoringForeignUserIdInBody() throws Exception {
        mockMvc.perform(post("/api/v1/subscriptions/subscribe")
                .with(sessionUser())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"planId\":3,\"userId\":" + FOREIGN_USER_ID + "}"))
                .andExpect(status().isOk());

        verify(subscriptionService).subscribeToPlan(SESSION_USER_ID, 3L);
    }

    @Test
    void subscribe_withoutPlanId_isBadRequest() throws Exception {
        mockMvc.perform(post("/api/v1/subscriptions/subscribe")
                .with(sessionUser())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(subscriptionService);
    }

    @Test
    void subscribe_anonymous_isUnauthorizedAndServiceUntouched() throws Exception {
        mockMvc.perform(post("/api/v1/subscriptions/subscribe")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"planId\":3}"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(subscriptionService);
    }

    // ---- Okuma ilerlemesi ----

    @Test
    void getProgress_usesSessionUserId_ignoringForeignUserIdParameter() throws Exception {
        mockMvc.perform(get("/api/v1/reading-progress/" + BOOK_ID)
                .param("userId", String.valueOf(FOREIGN_USER_ID))
                .with(sessionUser()))
                .andExpect(status().isOk());

        verify(readingProgressService).getProgress(SESSION_USER_ID, BOOK_ID);
    }

    @Test
    void updateProgress_usesSessionUserId_ignoringForeignUserIdInBody() throws Exception {
        mockMvc.perform(post("/api/v1/reading-progress/update")
                .with(sessionUser())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"bookId\":" + BOOK_ID + ",\"currentPage\":3,\"userId\":" + FOREIGN_USER_ID + "}"))
                .andExpect(status().isOk());

        ArgumentCaptor<ReadingProgressRequestDTO> captor = ArgumentCaptor.forClass(ReadingProgressRequestDTO.class);
        verify(readingProgressService).updatePage(org.mockito.ArgumentMatchers.eq(SESSION_USER_ID), captor.capture());
        assertThat(captor.getValue().getBookId()).isEqualTo(BOOK_ID);
        assertThat(captor.getValue().getCurrentPage()).isEqualTo(3);
    }

    @Test
    void myLibrary_usesSessionUserId_ignoringForeignUserIdParameter() throws Exception {
        when(readingProgressService.getUserProgressList(SESSION_USER_ID)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/reading-progress/my-library")
                .param("userId", String.valueOf(FOREIGN_USER_ID))
                .with(sessionUser()))
                .andExpect(status().isOk());

        verify(readingProgressService).getUserProgressList(SESSION_USER_ID);
    }

    @Test
    void readingProgress_anonymous_isUnauthorizedAndServiceUntouched() throws Exception {
        mockMvc.perform(get("/api/v1/reading-progress/" + BOOK_ID)).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/reading-progress/my-library")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/reading-progress/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"bookId\":5,\"currentPage\":1}"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(readingProgressService);
        verify(readingProgressService, org.mockito.Mockito.never()).updatePage(anyLong(), any());
    }
}

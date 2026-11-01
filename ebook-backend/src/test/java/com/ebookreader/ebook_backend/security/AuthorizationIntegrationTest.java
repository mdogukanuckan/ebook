package com.ebookreader.ebook_backend.security;

import com.ebookreader.ebook_backend.config.SecurityConfig;
import com.ebookreader.ebook_backend.modules.book.controller.BookController;
import com.ebookreader.ebook_backend.modules.book.dto.BookResponseDTO;
import com.ebookreader.ebook_backend.modules.book.service.BookService;
import com.ebookreader.ebook_backend.modules.book.service.FileStorageService;
import com.ebookreader.ebook_backend.modules.subscription.service.SubscriptionService;
import com.ebookreader.ebook_backend.modules.user.controller.UserController;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Rol tabanlı yetkilendirmeyi ve abonelik kontrollü dosya erişimini gerçek
 * SecurityConfig + JwtAuthenticationFilter ile doğrular; servisler mock'lanır.
 */
@WebMvcTest(controllers = { UserController.class, BookController.class })
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
class AuthorizationIntegrationTest {

    private static final long USER_ID = 10L;
    private static final long OTHER_USER_ID = 20L;
    private static final long ADMIN_ID = 1L;
    private static final long BOOK_ID = 5L;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;
    @MockitoBean
    private BookService bookService;
    @MockitoBean
    private FileStorageService fileStorageService;
    @MockitoBean
    private SubscriptionService subscriptionService;
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private static RequestPostProcessor as(long id, String roleName) {
        Role role = Role.builder().name(roleName).build();
        User user = User.builder()
                .username("user" + id)
                .email("user" + id + "@test.com")
                .password("x")
                .roles(Set.of(role))
                .build();
        user.setId(id);
        return authentication(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    private static RequestPostProcessor asUser() {
        return as(USER_ID, "ROLE_USER");
    }

    private static RequestPostProcessor asAdmin() {
        return as(ADMIN_ID, "ROLE_ADMIN");
    }

    private void stubBookFile() {
        when(bookService.getBookById(BOOK_ID)).thenReturn(BookResponseDTO.builder().id(BOOK_ID).filePath("books/a.pdf").build());
        when(fileStorageService.loadFileAsResource("books/a.pdf")).thenReturn(new ByteArrayResource(new byte[] { 1 }));
    }

    // ---- Geçersiz token ----

    @Test
    void malformedToken_isUnauthorized() throws Exception {
        when(jwtService.extractUsername("bad")).thenThrow(new MalformedJwtException("bad"));

        mockMvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void expiredToken_isUnauthorized() throws Exception {
        when(jwtService.extractUsername("old")).thenThrow(new ExpiredJwtException(null, null, "expired"));

        mockMvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer old"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenOfDeletedUser_isUnauthorized() throws Exception {
        when(jwtService.extractUsername("ghost")).thenReturn("ghost");
        when(userDetailsService.loadUserByUsername("ghost")).thenThrow(new UsernameNotFoundException("ghost"));

        mockMvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer ghost"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInQueryString_isIgnored() throws Exception {
        when(jwtService.extractUsername("valid")).thenReturn("ali");

        mockMvc.perform(get("/api/v1/users/me").param("token", "valid"))
                .andExpect(status().isUnauthorized());
        verify(jwtService, never()).extractUsername("valid");
    }

    @Test
    void authenticatedUserWithoutRole_stillGets403NotUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/users").with(asUser())).andExpect(status().isForbidden());
    }

    // ---- Kullanıcı yönetimi ----

    @Test
    void getAllUsers_anonymous_isUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isUnauthorized());
        verifyNoInteractions(userService);
    }

    @Test
    void getAllUsers_asUser_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users").with(asUser())).andExpect(status().isForbidden());
        verifyNoInteractions(userService);
    }

    @Test
    void getAllUsers_asAdmin_isOk() throws Exception {
        mockMvc.perform(get("/api/v1/users").with(asAdmin())).andExpect(status().isOk());
    }

    @Test
    void getUserById_ownRecord_isOk() throws Exception {
        when(userService.getUserById(USER_ID)).thenReturn(new UserResponseDTO());
        mockMvc.perform(get("/api/v1/users/" + USER_ID).with(asUser())).andExpect(status().isOk());
    }

    @Test
    void getUserById_otherUsersRecord_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users/" + OTHER_USER_ID).with(asUser())).andExpect(status().isForbidden());
        verifyNoInteractions(userService);
    }

    @Test
    void getUserById_otherUsersRecord_asAdmin_isOk() throws Exception {
        when(userService.getUserById(OTHER_USER_ID)).thenReturn(new UserResponseDTO());
        mockMvc.perform(get("/api/v1/users/" + OTHER_USER_ID).with(asAdmin())).andExpect(status().isOk());
    }

    @Test
    void deleteUser_asUser_isForbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/users/" + OTHER_USER_ID).with(asUser())).andExpect(status().isForbidden());
        verify(userService, never()).deleteUser(anyLong());
    }

    @Test
    void deleteUser_asAdmin_isNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/users/" + OTHER_USER_ID).with(asAdmin())).andExpect(status().isNoContent());
        verify(userService).deleteUser(OTHER_USER_ID);
    }

    @Test
    void roleEscalation_asUser_isForbidden() throws Exception {
        mockMvc.perform(put("/api/v1/users/" + USER_ID + "/admin")
                .with(asUser())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"roles\":[\"ROLE_ADMIN\"]}"))
                .andExpect(status().isForbidden());
        verify(userService, never()).updateUserByAdmin(anyLong(), any());
    }

    @Test
    void roleUpdate_asAdmin_isOk() throws Exception {
        when(userService.updateUserByAdmin(eq(USER_ID), any())).thenReturn(new UserResponseDTO());
        mockMvc.perform(put("/api/v1/users/" + USER_ID + "/admin")
                .with(asAdmin())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"roles\":[\"ROLE_USER\"]}"))
                .andExpect(status().isOk());
    }

    @Test
    void changePassword_ofAnotherUser_isForbidden() throws Exception {
        mockMvc.perform(put("/api/v1/users/" + OTHER_USER_ID + "/password")
                .with(asUser())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"old\",\"newPassword\":\"newpass1\",\"confirmPassword\":\"newpass1\"}"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(userService);
    }

    // ---- Kitap yönetimi ----

    @Test
    void deleteBook_asUser_isForbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/books/" + BOOK_ID).with(asUser())).andExpect(status().isForbidden());
        verify(bookService, never()).deleteBook(anyLong());
    }

    @Test
    void deleteBook_asAdmin_isNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/books/" + BOOK_ID).with(asAdmin())).andExpect(status().isNoContent());
        verify(bookService).deleteBook(BOOK_ID);
    }

    // ---- Abonelik kontrollü okuma / indirme ----

    @Test
    void viewBook_anonymous_isUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/books/view/" + BOOK_ID)).andExpect(status().isUnauthorized());
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void viewBook_withoutSufficientPlan_isForbiddenAndFileNotLoaded() throws Exception {
        when(subscriptionService.canAccessBook(USER_ID, BOOK_ID)).thenReturn(false);
        mockMvc.perform(get("/api/v1/books/view/" + BOOK_ID).with(asUser())).andExpect(status().isForbidden());
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void downloadBook_withoutSufficientPlan_isForbiddenAndFileNotLoaded() throws Exception {
        when(subscriptionService.canAccessBook(USER_ID, BOOK_ID)).thenReturn(false);
        mockMvc.perform(get("/api/v1/books/download/" + BOOK_ID).with(asUser())).andExpect(status().isForbidden());
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void viewBook_withSufficientPlan_isOk() throws Exception {
        stubBookFile();
        when(subscriptionService.canAccessBook(USER_ID, BOOK_ID)).thenReturn(true);
        mockMvc.perform(get("/api/v1/books/view/" + BOOK_ID).with(asUser())).andExpect(status().isOk());
    }

    @Test
    void downloadBook_withSufficientPlan_isOk() throws Exception {
        stubBookFile();
        when(subscriptionService.canAccessBook(USER_ID, BOOK_ID)).thenReturn(true);
        mockMvc.perform(get("/api/v1/books/download/" + BOOK_ID).with(asUser())).andExpect(status().isOk());
    }

    @Test
    void viewBook_asAdmin_bypassesSubscriptionCheck() throws Exception {
        stubBookFile();
        mockMvc.perform(get("/api/v1/books/view/" + BOOK_ID).with(asAdmin())).andExpect(status().isOk());
        verifyNoInteractions(subscriptionService);
    }
}

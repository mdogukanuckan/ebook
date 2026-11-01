package com.ebookreader.ebook_backend.common.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.http.HttpMethod;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/login");

    @Test
    void unexpectedErrors_doNotLeakClassOrMessage() {
        ResponseEntity<ErrorResponseDTO> response =
                handler.handleGeneralException(new IllegalStateException("db password is hunter2"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().getMessage())
                .doesNotContain("IllegalStateException")
                .doesNotContain("hunter2");
    }

    @Test
    void badCredentials_isUnauthorizedWithAGenericMessage() {
        ResponseEntity<ErrorResponseDTO> response =
                handler.handleAuthenticationException(new BadCredentialsException("Bad credentials"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().getMessage()).isEqualTo("Kullanıcı adı veya şifre hatalı.");
    }

    @Test
    void disabledAccount_looksTheSameAsBadCredentials() {
        ResponseEntity<ErrorResponseDTO> disabled =
                handler.handleAuthenticationException(new DisabledException("User is disabled"), request);
        ResponseEntity<ErrorResponseDTO> bad =
                handler.handleAuthenticationException(new BadCredentialsException("Bad credentials"), request);

        assertThat(disabled.getBody().getMessage()).isEqualTo(bad.getBody().getMessage());
    }

    @Test
    void frameworkRoutingErrors_keepTheirStatus() throws Exception {
        assertThat(handler.handleNoResource(new NoResourceFoundException(HttpMethod.POST, "/api/v1/x"), request)
                .getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(handler.handleMethodNotSupported(new HttpRequestMethodNotSupportedException("PATCH"), request)
                .getStatusCode()).isEqualTo(HttpStatus.METHOD_NOT_ALLOWED);
        assertThat(handler.handleBadRequest(new IllegalArgumentException("x"), request)
                .getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}

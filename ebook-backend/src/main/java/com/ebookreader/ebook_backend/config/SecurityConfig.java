package com.ebookreader.ebook_backend.config;

import com.ebookreader.ebook_backend.security.CustomUserDetailsService;
import com.ebookreader.ebook_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig: Uygulamanın merkezi güvenlik beynidir.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Kayıt ve Giriş uç noktaları herkese açık olmalı
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Diğer her şey için geçerli bir JWT Token şart
                        .anyRequest().authenticated()
                )
                // Mühendislik Notu: Stateless (Durumsuz) Mimari.
                // Sunucu session tutmaz, her istekte token bekler.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // İşte eksik olan sağlayıcıyı buraya bağlıyoruz
                .authenticationProvider(authenticationProvider())
                // Kendi yazdığımız filtreyi standart filtreden ÖNCE çalıştırıyoruz
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * AuthenticationProvider: Kullanıcıyı bulup doğrulayan gerçek mekanizma.
     * Mühendislik Mantığı: 'DaoAuthenticationProvider' kullanarak
     * UserDetailsService ve PasswordEncoder'ı birleştiriyoruz.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * AuthenticationManager: Kimlik doğrulama sürecini yöneten orkestra şefi.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * PasswordEncoder: Şifreleri BCrypt ile hash'ler.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
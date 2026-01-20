package com.ebookreader.ebook_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * SecurityConfig: Uygulamanın güvenlik duvarıdır.
 * Mühendislik Mantığı: Spring Security bir 'Filter Chain' (Filtre Zinciri)
 * mantığıyla çalışır.
 * İstekler denetleyiciye (Controller) ulaşmadan önce bu süzgeçlerden geçer.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF Devre Dışı Bırakma:
                // Mühendislik Notu: Postman ile test yaparken 'Cross-Site Request Forgery'
                // koruması POST isteklerini engeller. Stateless (JWT) bir yapı kuracağımız için
                // bu korumayı devre dışı bırakıyoruz.
                .csrf(AbstractHttpConfigurer::disable)

                // 2. İstek Yetkilendirme:
                .authorizeHttpRequests(auth -> auth
                        // Kayıt olma endpoint'ini herkese açıyoruz.
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/users/register").permitAll()
                        // Diğer tüm istekler için kimlik doğrulaması şart koşuyoruz.
                        .anyRequest().authenticated())

                // 3. Basic Auth: Şimdilik testler için aktif kalsın.
                .httpBasic(withDefaults());

        return http.build();
    }

    /**
     * PasswordEncoder: Şifreleri güvenli bir şekilde hash'lemek için BCrypt
     * kullanıyoruz.
     * Mühendislik Mantığı: Veritabanına asla düz metin şifre kaydedilmez.
     * BCrypt, 'salt' kullanarak aynı şifre için her seferinde farklı bir hash
     * üretir.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
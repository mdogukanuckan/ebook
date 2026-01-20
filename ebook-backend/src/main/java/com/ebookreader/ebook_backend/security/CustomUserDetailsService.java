package com.ebookreader.ebook_backend.security;

import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * CustomUserDetailsService: Spring Security'nin veritabanımızla iletişim kurmasını sağlayan servis.
 * Mühendislik Mantığı: UserDetailsService arayüzünü (interface) implemente ederek,
 * Spring'e kullanıcıları nasıl yükleyeceğini (loadByUsername) tarif ediyoruz.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Adım: Kullanıcıyı veritabanında ara.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı adı bulunamadı: " + username));

        // 2. Adım: Kendi User entity'mizi Spring Security'nin anladığı UserDetails'e dönüştür.
        // Mühendislik Notu: Rollerimizi 'SimpleGrantedAuthority' listesine çeviriyoruz ki
        // Spring Security yetkilendirme (authorization) yapabilsin.
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toList())
        );
    }
}
package com.ebookreader.ebook_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// Ana sınıftan ayrıldı: @WebMvcTest dilimleri JPA'sız bağlam kurabilsin diye.
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}

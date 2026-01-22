package com.ebookreader.ebook_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**") // Tüm API uç noktaları için geçerli
                .allowedOrigins("http://localhost:5173") // React projenin adresi (Vite varsayılanı)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen HTTP metotları
                .allowedHeaders("*") // Tüm başlıklara izin ver
                .allowCredentials(true); // Cookie veya Auth bilgilerine izin ver
    }
}

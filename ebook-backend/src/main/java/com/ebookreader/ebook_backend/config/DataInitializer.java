package com.ebookreader.ebook_backend.config;

import com.ebookreader.ebook_backend.modules.user.entity.Role;
import com.ebookreader.ebook_backend.modules.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        initializeRoles();
    }

    private void initializeRoles() {

        createRoleIfNotFound("ROLE_USER", "Standart kullanıcı yetkileri");
        createRoleIfNotFound("ROLE_ADMIN", "Sistem yönetimi ve kitap ekleme yetkileri");
        createRoleIfNotFound("ROLE_AUTHOR", "Yazar profili yönetimi yetkileri");
    }

    private void createRoleIfNotFound(String name, String description) {

        if (!roleRepository.findByName(name).isPresent()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            roleRepository.save(role);

            System.out.println("[DataInitializer] Rol oluşturuldu: " + name);
        }
    }
}
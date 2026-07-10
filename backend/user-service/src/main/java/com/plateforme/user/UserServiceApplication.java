package com.plateforme.user;

import com.plateforme.user.model.*;
import com.plateforme.user.repository.CompteUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(CompteUserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByEmail("admin@plateforme.com")) {
                repo.save(CompteUser.builder()
                        .email("admin@plateforme.com")
                        .motDePasse(encoder.encode("admin123"))
                        .nom("Administrateur")
                        .prenom("Admin")
                        .role(RoleCompte.ADMIN)
                        .statut(StatutCompte.APPROVED)
                        .build());
                System.out.println("Compte admin créé: admin@plateforme.com / admin123");
            }
        };
    }
}

package com.plateforme.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.plateforme.user.model.*;
import com.plateforme.user.repository.CompteUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceApplicationTest {

    @Mock
    private CompteUserRepository compteUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
        UserServiceApplication application = new UserServiceApplication();
        assertThat(application).isNotNull();
    }

    @Test
    void seedAdminShouldCreateAdminWhenNotExists() throws Exception {
        when(compteUserRepository.existsByEmail("admin@plateforme.com")).thenReturn(false);
        when(passwordEncoder.encode("admin123")).thenReturn("$2a$encoded");
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(null);

        UserServiceApplication application = new UserServiceApplication();
        var runner = application.seedAdmin(compteUserRepository, passwordEncoder);
        runner.run();

        verify(compteUserRepository).save(argThat(c ->
            c.getEmail().equals("admin@plateforme.com") &&
            c.getRole() == RoleCompte.ADMIN &&
            c.getStatut() == StatutCompte.APPROVED
        ));
    }

    @Test
    void seedAdminShouldSkipWhenAdminExists() throws Exception {
        when(compteUserRepository.existsByEmail("admin@plateforme.com")).thenReturn(true);

        UserServiceApplication application = new UserServiceApplication();
        var runner = application.seedAdmin(compteUserRepository, passwordEncoder);
        runner.run();

        verify(compteUserRepository, never()).save(any());
    }
}

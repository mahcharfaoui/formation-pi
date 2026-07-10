package com.plateforme.user.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    private final SecurityConfig securityConfig = new SecurityConfig();

    @Mock
    private HttpSecurity httpSecurity;

    @Test
    void passwordEncoderShouldReturnBCrypt() {
        assertThat(securityConfig.passwordEncoder()).isInstanceOf(BCryptPasswordEncoder.class);
    }

    @Test
    void restTemplateShouldBeCreated() {
        assertThat(securityConfig.restTemplate()).isInstanceOf(RestTemplate.class);
    }
}

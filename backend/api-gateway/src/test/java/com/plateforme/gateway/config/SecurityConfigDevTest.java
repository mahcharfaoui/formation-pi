package com.plateforme.gateway.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class SecurityConfigDevTest {

    @Autowired
    private SecurityWebFilterChain securityWebFilterChain;

    @Test
    void shouldCreateSecurityFilterChainForDevProfile() {
        assertThat(securityWebFilterChain).isNotNull();
    }
}

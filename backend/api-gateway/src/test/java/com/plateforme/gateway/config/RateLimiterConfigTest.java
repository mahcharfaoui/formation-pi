package com.plateforme.gateway.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class RateLimiterConfigTest {

    @Autowired
    private RedisRateLimiter redisRateLimiter;

    @Autowired
    private KeyResolver keyResolver;

    @Test
    void shouldCreateRedisRateLimiter() {
        assertThat(redisRateLimiter).isNotNull();
        assertThat(redisRateLimiter).isInstanceOf(RedisRateLimiter.class);
    }

    @Test
    void shouldCreateKeyResolver() {
        assertThat(keyResolver).isNotNull();
    }
}

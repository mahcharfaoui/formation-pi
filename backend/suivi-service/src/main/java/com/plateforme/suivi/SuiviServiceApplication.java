package com.plateforme.suivi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SuiviServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SuiviServiceApplication.class, args);
    }
}

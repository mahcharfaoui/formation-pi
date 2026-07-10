package com.plateforme.user.service;

import com.plateforme.user.dto.*;
import com.plateforme.user.model.*;
import com.plateforme.user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final CompteUserRepository compteUserRepository;
    private final ApprenantRepository apprenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    public CompteUserResponse register(RegisterRequest request) {
        if (compteUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        CompteUser compte = CompteUser.builder()
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .role(request.getRole())
                .statut(StatutCompte.PENDING)
                .build();

        compte = compteUserRepository.save(compte);
        return toResponse(compte);
    }

    public LoginResponse login(LoginRequest request) {
        CompteUser compte = compteUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), compte.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        if (compte.getStatut() == StatutCompte.PENDING) {
            throw new RuntimeException("Votre compte est en attente d'approbation par l'administrateur");
        }
        if (compte.getStatut() == StatutCompte.REJECTED) {
            throw new RuntimeException("Votre compte a été refusé par l'administrateur");
        }

        String token = UUID.randomUUID().toString();

        return LoginResponse.builder()
                .id(compte.getId())
                .email(compte.getEmail())
                .nom(compte.getNom())
                .prenom(compte.getPrenom())
                .role(compte.getRole())
                .statut(compte.getStatut())
                .token(token)
                .build();
    }

    public List<CompteUserResponse> getPendingUsers() {
        return compteUserRepository.findByStatut(StatutCompte.PENDING)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CompteUserResponse> getAllUsers() {
        return compteUserRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CompteUserResponse approveUser(Long id) {
        CompteUser compte = compteUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        compte.setStatut(StatutCompte.APPROVED);
        compte = compteUserRepository.save(compte);

        if (compte.getRole() == RoleCompte.ETUDIANT) {
            if (apprenantRepository.findByEmail(compte.getEmail()).isEmpty()) {
                Apprenant apprenant = Apprenant.builder()
                        .nom(compte.getNom())
                        .prenom(compte.getPrenom())
                        .email(compte.getEmail())
                        .statut(StatutApprenant.ACTIF)
                        .build();
                apprenantRepository.save(apprenant);
            }
        }

        if (compte.getRole() == RoleCompte.FORMATEUR) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                Map<String, Object> body = Map.of(
                        "nom", compte.getNom(),
                        "prenom", compte.getPrenom(),
                        "email", compte.getEmail(),
                        "actif", true
                );
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                restTemplate.postForObject("http://formateur-service:8083/api/formateurs", request, Void.class);
            } catch (Exception e) {
                System.err.println("Erreur creation formateur dans formateur-service: " + e.getMessage());
            }
        }

        return toResponse(compte);
    }

    public CompteUserResponse rejectUser(Long id) {
        CompteUser compte = compteUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        compte.setStatut(StatutCompte.REJECTED);
        compte = compteUserRepository.save(compte);
        return toResponse(compte);
    }

    private CompteUserResponse toResponse(CompteUser compte) {
        return CompteUserResponse.builder()
                .id(compte.getId())
                .email(compte.getEmail())
                .nom(compte.getNom())
                .prenom(compte.getPrenom())
                .role(compte.getRole())
                .statut(compte.getStatut())
                .dateCreation(compte.getDateCreation())
                .build();
    }
}

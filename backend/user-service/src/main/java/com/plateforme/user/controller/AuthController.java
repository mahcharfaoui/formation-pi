package com.plateforme.user.controller;

import com.plateforme.user.dto.*;
import com.plateforme.user.model.ApprenantFormation;
import com.plateforme.user.model.CompteUser;
import com.plateforme.user.model.RoleCompte;
import com.plateforme.user.repository.ApprenantFormationRepository;
import com.plateforme.user.repository.CompteUserRepository;
import com.plateforme.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "API d'inscription, connexion et gestion des comptes")
public class AuthController {

    private final AuthService authService;
    private final CompteUserRepository compteUserRepository;
    private final ApprenantFormationRepository apprenantFormationRepository;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            CompteUserResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/pending")
    @Operation(summary = "Liste des comptes en attente d'approbation")
    public ResponseEntity<List<CompteUserResponse>> getPendingUsers() {
        return ResponseEntity.ok(authService.getPendingUsers());
    }

    @GetMapping("/users")
    @Operation(summary = "Liste de tous les comptes utilisateurs")
    public ResponseEntity<List<CompteUserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PutMapping("/approve/{id}")
    @Operation(summary = "Approuver un compte utilisateur")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            CompteUserResponse response = authService.approveUser(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reject/{id}")
    @Operation(summary = "Refuser un compte utilisateur")
    public ResponseEntity<CompteUserResponse> rejectUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.rejectUser(id));
    }

    @GetMapping("/me/{id}")
    @Operation(summary = "Obtenir les infos d'un compte par ID")
    public ResponseEntity<?> getCompte(@PathVariable Long id) {
        return compteUserRepository.findById(id)
                .map(c -> ResponseEntity.ok(toResponse(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Supprimer un compte utilisateur")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        compteUserRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/apprenant/{apprenantId}/formations")
    @Operation(summary = "Liste des IDs formations choisies par un apprenant")
    public ResponseEntity<List<Long>> getFormationsChoisies(@PathVariable Long apprenantId) {
        List<Long> ids = apprenantFormationRepository.findByApprenantId(apprenantId)
                .stream().map(ApprenantFormation::getFormationId).collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/apprenant/{apprenantId}/formations")
    @Operation(summary = "Sauvegarder les choix de formations d'un apprenant")
    public ResponseEntity<?> sauvegarderFormationsChoisies(
            @PathVariable Long apprenantId, @RequestBody List<Long> formationIds) {
        apprenantFormationRepository.deleteByApprenantId(apprenantId);
        formationIds.forEach(fid ->
            apprenantFormationRepository.save(
                ApprenantFormation.builder().apprenantId(apprenantId).formationId(fid).build())
        );
        return ResponseEntity.ok(formationIds);
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

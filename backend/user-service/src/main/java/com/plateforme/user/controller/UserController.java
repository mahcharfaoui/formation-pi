package com.plateforme.user.controller;

import com.plateforme.user.model.*;
import com.plateforme.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "API de gestion des apprenants")
public class UserController {

    private final UserService userService;

    @GetMapping("/apprenants")
    @Operation(summary = "Lister tous les apprenants")
    public ResponseEntity<List<Apprenant>> getAllApprenants() {
        return ResponseEntity.ok(userService.getAllApprenants());
    }

    @GetMapping("/apprenants/{id}")
    @Operation(summary = "Obtenir un apprenant par ID")
    public ResponseEntity<Apprenant> getApprenantById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getApprenantById(id));
    }

    @GetMapping("/apprenants/email/{email}")
    @Operation(summary = "Obtenir un apprenant par email")
    public ResponseEntity<Apprenant> getApprenantByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getApprenantByEmail(email));
    }

    @PostMapping("/apprenants")
    @Operation(summary = "Créer un apprenant")
    public ResponseEntity<Apprenant> creerApprenant(@RequestBody Apprenant apprenant) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.creerApprenant(apprenant));
    }

    @PutMapping("/apprenants/{id}")
    @Operation(summary = "Mettre à jour un apprenant")
    public ResponseEntity<Apprenant> mettreAJourApprenant(
            @PathVariable Long id, @RequestBody Apprenant apprenant) {
        return ResponseEntity.ok(userService.mettreAJourApprenant(id, apprenant));
    }

    @DeleteMapping("/apprenants/{id}")
    @Operation(summary = "Supprimer un apprenant")
    public ResponseEntity<Void> supprimerApprenant(@PathVariable Long id) {
        userService.supprimerApprenant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/apprenants/recherche")
    @Operation(summary = "Rechercher des apprenants")
    public ResponseEntity<List<Apprenant>> rechercherApprenants(@RequestParam String motCle) {
        return ResponseEntity.ok(userService.rechercheApprenants(motCle));
    }

    // Endpoints pour les compétences
    @GetMapping("/apprenants/{apprenantId}/competences")
    public ResponseEntity<List<Competence>> getCompetences(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(userService.getCompetencesApprenant(apprenantId));
    }

    @PostMapping("/competences")
    public ResponseEntity<Competence> ajouterCompetence(@RequestBody Competence competence) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.ajouterCompetence(competence));
    }

    @PutMapping("/competences/{id}")
    public ResponseEntity<Competence> mettreAJourCompetence(
            @PathVariable Long id, @RequestBody Competence competence) {
        return ResponseEntity.ok(userService.mettreAJourCompetence(id, competence));
    }

    @DeleteMapping("/competences/{id}")
    public ResponseEntity<Void> supprimerCompetence(@PathVariable Long id) {
        userService.supprimerCompetence(id);
        return ResponseEntity.noContent().build();
    }
}

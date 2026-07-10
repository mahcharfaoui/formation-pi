package com.plateforme.session.controller;

import com.plateforme.session.model.*;
import com.plateforme.session.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "API de gestion des sessions et inscriptions")
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    @Operation(summary = "Lister toutes les sessions")
    public ResponseEntity<List<SessionFormation>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une session par ID")
    public ResponseEntity<SessionFormation> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une session")
    public ResponseEntity<SessionFormation> creerSession(@RequestBody SessionFormation session) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.creerSession(session));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une session")
    public ResponseEntity<SessionFormation> mettreAJourSession(
            @PathVariable Long id, @RequestBody SessionFormation session) {
        return ResponseEntity.ok(sessionService.mettreAJourSession(id, session));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une session")
    public ResponseEntity<Void> supprimerSession(@PathVariable Long id) {
        sessionService.supprimerSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<SessionFormation>> getSessionsParFormation(
            @PathVariable Long formationId) {
        return ResponseEntity.ok(sessionService.getSessionsParFormation(formationId));
    }

    @GetMapping("/formateur/{formateurId}")
    public ResponseEntity<List<SessionFormation>> getSessionsParFormateur(
            @PathVariable Long formateurId) {
        return ResponseEntity.ok(sessionService.getSessionsParFormateur(formateurId));
    }

    // Endpoints pour les inscriptions
    @PostMapping("/{sessionId}/inscriptions/apprenant/{apprenantId}")
    @Operation(summary = "Inscrire un apprenant à une session")
    public ResponseEntity<Inscription> inscrireApprenant(
            @PathVariable Long sessionId, @PathVariable Long apprenantId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.inscrireApprenant(sessionId, apprenantId));
    }

    @PutMapping("/inscriptions/{inscriptionId}/annuler")
    @Operation(summary = "Annuler une inscription")
    public ResponseEntity<Void> annulerInscription(@PathVariable Long inscriptionId) {
        sessionService.annulerInscription(inscriptionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sessionId}/inscriptions")
    public ResponseEntity<List<Inscription>> getInscriptionsParSession(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getInscriptionsParSession(sessionId));
    }

    @GetMapping("/apprenant/{apprenantId}/inscriptions")
    public ResponseEntity<List<Inscription>> getInscriptionsParApprenant(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(sessionService.getInscriptionsParApprenant(apprenantId));
    }
}

package com.plateforme.suivi.controller;

import com.plateforme.suivi.model.*;
import com.plateforme.suivi.service.SuiviService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suivi")
@RequiredArgsConstructor
@Tag(name = "Suivi", description = "API de suivi pédagogique")
public class SuiviController {

    private final SuiviService suiviService;

    @GetMapping("/apprenant/{apprenantId}/progressions")
    @Operation(summary = "Obtenir les progressions d'un apprenant")
    public ResponseEntity<List<Progression>> getProgressionsApprenant(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(suiviService.getProgressionsApprenant(apprenantId));
    }

    @GetMapping("/apprenant/{apprenantId}/formation/{formationId}/progressions")
    public ResponseEntity<List<Progression>> getProgressionsParFormation(
            @PathVariable Long apprenantId, @PathVariable Long formationId) {
        return ResponseEntity.ok(suiviService.getProgressionsParFormation(apprenantId, formationId));
    }

    @PostMapping("/progressions")
    public ResponseEntity<Progression> mettreAJourProgression(
            @RequestParam Long apprenantId,
            @RequestParam Long formationId,
            @RequestParam Long chapitreId,
            @RequestParam Integer pourcentage) {
        return ResponseEntity.ok(suiviService.mettreAJourProgression(apprenantId, formationId, chapitreId, pourcentage));
    }

    @GetMapping("/apprenant/{apprenantId}/formation/{formationId}/progression-globale")
    public ResponseEntity<Double> getProgressionGlobale(
            @PathVariable Long apprenantId, @PathVariable Long formationId) {
        return ResponseEntity.ok(suiviService.getProgressionGlobale(apprenantId, formationId));
    }

    @PostMapping("/logs")
    public ResponseEntity<LogLecture> enregistrerLecture(@RequestBody LogLecture logLecture) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.enregistrerLecture(logLecture));
    }

    @GetMapping("/apprenant/{apprenantId}/logs")
    public ResponseEntity<List<LogLecture>> getLogsApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(suiviService.getLogsApprenant(apprenantId));
    }

    @PostMapping("/avis")
    public ResponseEntity<Avis> ajouterAvis(@RequestBody Avis avis) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.ajouterAvis(avis));
    }

    @GetMapping("/formation/{formationId}/avis")
    public ResponseEntity<List<Avis>> getAvisParFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(suiviService.getAvisParFormation(formationId));
    }

    @GetMapping("/formation/{formationId}/note-moyenne")
    public ResponseEntity<Double> getNoteMoyenneFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(suiviService.getNoteMoyenneFormation(formationId));
    }
}

package com.plateforme.ml.controller;

import com.plateforme.ml.model.ProfilApprenant;
import com.plateforme.ml.model.ProfilAnalyse;
import com.plateforme.ml.model.Recommandation;
import com.plateforme.ml.service.RecommandationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
@Tag(name = "ML", description = "API de recommandations et analyse IA")
public class MlController {

    private final RecommandationService recommandationService;

    @PostMapping("/recommandations")
    @Operation(summary = "Obtenir des recommandations de formations")
    public ResponseEntity<List<Recommandation>> getRecommandations(
            @RequestBody ProfilApprenant profil) {
        return ResponseEntity.ok(recommandationService.recommanderFormations(profil));
    }

    @GetMapping("/analyse/{apprenantId}")
    @Operation(summary = "Analyser la progression d'un apprenant")
    public ResponseEntity<Map<String, Object>> analyserProgression(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(recommandationService.analyserProgression(apprenantId));
    }

    @GetMapping("/analyse-profil/{apprenantId}")
    @Operation(summary = "Analyse complète du profil d'un apprenant")
    public ResponseEntity<ProfilAnalyse> analyseProfilComplet(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(recommandationService.analyserProfilComplet(apprenantId));
    }
}

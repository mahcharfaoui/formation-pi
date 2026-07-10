package com.plateforme.formateur.controller;

import com.plateforme.formateur.model.*;
import com.plateforme.formateur.service.FormateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
@RequiredArgsConstructor
@Tag(name = "Formateurs", description = "API de gestion des formateurs")
public class FormateurController {

    private final FormateurService formateurService;

    @GetMapping
    @Operation(summary = "Lister tous les formateurs")
    public ResponseEntity<List<Formateur>> getAllFormateurs() {
        return ResponseEntity.ok(formateurService.getAllFormateurs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un formateur par ID")
    public ResponseEntity<Formateur> getFormateurById(@PathVariable Long id) {
        return ResponseEntity.ok(formateurService.getFormateurById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un formateur")
    public ResponseEntity<Formateur> creerFormateur(@RequestBody Formateur formateur) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formateurService.creerFormateur(formateur));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un formateur")
    public ResponseEntity<Formateur> mettreAJourFormateur(
            @PathVariable Long id, @RequestBody Formateur formateur) {
        return ResponseEntity.ok(formateurService.mettreAJourFormateur(id, formateur));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un formateur")
    public ResponseEntity<Void> supprimerFormateur(@PathVariable Long id) {
        formateurService.supprimerFormateur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recherche")
    @Operation(summary = "Rechercher des formateurs")
    public ResponseEntity<List<Formateur>> rechercherFormateurs(@RequestParam String motCle) {
        return ResponseEntity.ok(formateurService.rechercheFormateurs(motCle));
    }

    @GetMapping("/{formateurId}/expertises")
    public ResponseEntity<List<Expertise>> getExpertises(@PathVariable Long formateurId) {
        return ResponseEntity.ok(formateurService.getExpertisesFormateur(formateurId));
    }

    @PostMapping("/expertises")
    public ResponseEntity<Expertise> ajouterExpertise(@RequestBody Expertise expertise) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formateurService.ajouterExpertise(expertise));
    }

    @GetMapping("/{formateurId}/disponibilites")
    public ResponseEntity<List<Disponibilite>> getDisponibilites(@PathVariable Long formateurId) {
        return ResponseEntity.ok(formateurService.getDisponibilitesFormateur(formateurId));
    }

    @PostMapping("/disponibilites")
    public ResponseEntity<Disponibilite> ajouterDisponibilite(@RequestBody Disponibilite disponibilite) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formateurService.ajouterDisponibilite(disponibilite));
    }

    @GetMapping("/{formateurId}/evaluations")
    public ResponseEntity<List<Evaluation>> getEvaluations(@PathVariable Long formateurId) {
        return ResponseEntity.ok(formateurService.getEvaluationsFormateur(formateurId));
    }

    @GetMapping("/{formateurId}/note-moyenne")
    public ResponseEntity<Double> getNoteMoyenne(@PathVariable Long formateurId) {
        return ResponseEntity.ok(formateurService.getNoteMoyenneFormateur(formateurId));
    }
}

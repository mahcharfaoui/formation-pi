package com.plateforme.catalogue.controller;

import com.plateforme.catalogue.model.*;
import com.plateforme.catalogue.service.CatalogueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalogue")
@RequiredArgsConstructor
@Tag(name = "Catalogue", description = "API de gestion des formations")
public class CatalogueController {

    private final CatalogueService catalogueService;

    @GetMapping("/formations")
    @Operation(summary = "Lister toutes les formations")
    public ResponseEntity<List<Formation>> getAllFormations() {
        return ResponseEntity.ok(catalogueService.getAllFormations());
    }

    @GetMapping("/formations/{id}")
    @Operation(summary = "Obtenir une formation par ID")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogueService.getFormationById(id));
    }

    @PostMapping("/formations")
    @Operation(summary = "Créer une nouvelle formation")
    public ResponseEntity<Formation> creerFormation(@RequestBody Formation formation) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogueService.creerFormation(formation));
    }

    @PutMapping("/formations/{id}")
    @Operation(summary = "Mettre à jour une formation")
    public ResponseEntity<Formation> mettreAJourFormation(
            @PathVariable Long id, @RequestBody Formation formation) {
        return ResponseEntity.ok(catalogueService.mettreAJourFormation(id, formation));
    }

    @DeleteMapping("/formations/{id}")
    @Operation(summary = "Supprimer une formation")
    public ResponseEntity<Void> supprimerFormation(@PathVariable Long id) {
        catalogueService.supprimerFormation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formations/recherche")
    @Operation(summary = "Rechercher des formations par mot-clé")
    public ResponseEntity<List<Formation>> rechercherFormations(
            @RequestParam String motCle) {
        return ResponseEntity.ok(catalogueService.rechercherFormations(motCle));
    }

    @GetMapping("/formations/categorie/{categorieId}")
    @Operation(summary = "Lister les formations par catégorie")
    public ResponseEntity<List<Formation>> getFormationsParCategorie(
            @PathVariable Long categorieId) {
        return ResponseEntity.ok(catalogueService.getFormationsParCategorie(categorieId));
    }

    @GetMapping("/formations/niveau/{niveau}")
    @Operation(summary = "Lister les formations par niveau")
    public ResponseEntity<List<Formation>> getFormationsParNiveau(
            @PathVariable String niveau) {
        return ResponseEntity.ok(catalogueService.getFormationsParNiveau(niveau));
    }

    // Endpoints pour les catégories
    @GetMapping("/categories")
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return ResponseEntity.ok(catalogueService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Categorie> creerCategorie(@RequestBody Categorie categorie) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogueService.creerCategorie(categorie));
    }

    // Upload de fichier (PDF, images...)
    @PostMapping("/upload")
    @Operation(summary = "Uploader un fichier (PDF, image...)")
    public ResponseEntity<?> uploadFichier(@RequestParam("file") MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf(".")) : "";
            String fileName = UUID.randomUUID().toString() + extension;
            Path uploadDir = Paths.get("uploads/pdf");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());
            String fileUrl = "/uploads/pdf/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl, "fileName", fileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'upload: " + e.getMessage()));
        }
    }

    // Endpoints pour les chapitres
    @GetMapping("/formations/{formationId}/chapitres")
    public ResponseEntity<List<Chapitre>> getChapitresParFormation(
            @PathVariable Long formationId) {
        return ResponseEntity.ok(catalogueService.getChapitresParFormation(formationId));
    }

    @PostMapping("/chapitres")
    public ResponseEntity<?> ajouterChapitre(@RequestBody Chapitre chapitre) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(catalogueService.ajouterChapitre(chapitre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "cause",
                    e.getCause() != null ? e.getCause().getMessage() : "none"));
        }
    }

    @PutMapping("/chapitres/{id}")
    public ResponseEntity<Chapitre> mettreAJourChapitre(
            @PathVariable Long id, @RequestBody Chapitre chapitre) {
        return ResponseEntity.ok(catalogueService.mettreAJourChapitre(id, chapitre));
    }

    @DeleteMapping("/chapitres/{id}")
    public ResponseEntity<Void> supprimerChapitre(@PathVariable Long id) {
        catalogueService.supprimerChapitre(id);
        return ResponseEntity.noContent().build();
    }
}

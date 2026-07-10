package com.plateforme.certification.controller;

import com.plateforme.certification.model.*;
import com.plateforme.certification.service.CertificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@Tag(name = "Certifications", description = "API de gestion des certifications et diplômes")
public class CertificationController {

    private final CertificationService certificationService;

    @GetMapping
    @Operation(summary = "Lister tous les certificats")
    public ResponseEntity<List<Certificat>> getAllCertificats() {
        return ResponseEntity.ok(certificationService.getAllCertificats());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un certificat par ID")
    public ResponseEntity<Certificat> getCertificatById(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getCertificatById(id));
    }

    @GetMapping("/numero/{numero}")
    @Operation(summary = "Obtenir un certificat par numéro")
    public ResponseEntity<Certificat> getCertificatByNumero(@PathVariable String numero) {
        return ResponseEntity.ok(certificationService.getCertificatByNumero(numero));
    }

    @PostMapping
    @Operation(summary = "Générer un certificat")
    public ResponseEntity<Certificat> genererCertificat(@RequestBody Certificat certificat) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificationService.genererCertificat(certificat));
    }

    @PutMapping("/{id}/valider")
    @Operation(summary = "Valider un certificat")
    public ResponseEntity<Certificat> validerCertificat(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.validerCertificat(id));
    }

    @PutMapping("/{id}/revoquer")
    @Operation(summary = "Révoquer un certificat")
    public ResponseEntity<Certificat> revoquerCertificat(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.revoquerCertificat(id));
    }

    @GetMapping("/apprenant/{apprenantId}")
    public ResponseEntity<List<Certificat>> getCertificatsApprenant(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(certificationService.getCertificatsApprenant(apprenantId));
    }

    @GetMapping("/apprenant/{apprenantId}/actifs")
    public ResponseEntity<List<Certificat>> getCertificatsActifs(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(certificationService.getCertificatsActifsApprenant(apprenantId));
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Certificat>> getCertificatsParFormation(
            @PathVariable Long formationId) {
        return ResponseEntity.ok(certificationService.getCertificatsParFormation(formationId));
    }

    @GetMapping("/verifier/{numero}")
    public ResponseEntity<Boolean> verifierValidite(@PathVariable String numero) {
        return ResponseEntity.ok(certificationService.verifierValiditeCertificat(numero));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Télécharger le certificat en PDF")
    public ResponseEntity<byte[]> telechargerPdf(@PathVariable Long id) {
        byte[] pdf = certificationService.genererPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "certificat-" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    // Endpoints pour les modèles
    @GetMapping("/modeles")
    public ResponseEntity<List<ModeleDocument>> getAllModeles() {
        return ResponseEntity.ok(certificationService.getAllModeles());
    }

    @PostMapping("/modeles")
    public ResponseEntity<ModeleDocument> creerModele(@RequestBody ModeleDocument modele) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificationService.creerModele(modele));
    }
}

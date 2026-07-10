package com.plateforme.certification.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.plateforme.certification.model.*;
import com.plateforme.certification.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CertificationService {

    private final CertificatRepository certificatRepository;
    private final ModeleDocumentRepository modeleDocumentRepository;
    private final RestTemplate restTemplate;

    public List<Certificat> getAllCertificats() {
        return certificatRepository.findAll();
    }

    public Certificat getCertificatById(Long id) {
        return certificatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificat non trouvé avec l'id: " + id));
    }

    public Certificat getCertificatByNumero(String numero) {
        return certificatRepository.findByNumeroCertificat(numero)
                .orElseThrow(() -> new RuntimeException("Certificat non trouvé avec le numéro: " + numero));
    }

    public Certificat genererCertificat(Certificat certificat) {
        certificat.setNumeroCertificat("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificat.setDateObtention(LocalDate.now());
        certificat.setDateExpiration(LocalDate.now().plusYears(2));
        certificat.setStatut(StatutCertificat.ACTIF);

        try {
            Map apprenant = restTemplate.exchange(
                "http://user-service:8082/api/users/apprenants/{id}",
                HttpMethod.GET, null, Map.class, certificat.getApprenantId()
            ).getBody();
            if (apprenant != null) {
                certificat.setApprenantNom((String) apprenant.get("nom"));
                certificat.setApprenantPrenom((String) apprenant.get("prenom"));
            }
        } catch (Exception e) {
            System.err.println("Impossible de recuperer l'apprenant: " + e.getMessage());
        }

        try {
            Map formation = restTemplate.exchange(
                "http://catalogue-service:8081/api/catalogue/formations/{id}",
                HttpMethod.GET, null, Map.class, certificat.getFormationId()
            ).getBody();
            if (formation != null) {
                certificat.setFormationTitre((String) formation.get("titre"));
            }
        } catch (Exception e) {
            System.err.println("Impossible de recuperer la formation: " + e.getMessage());
        }

        return certificatRepository.save(certificat);
    }

    public Certificat validerCertificat(Long id) {
        Certificat certificat = getCertificatById(id);
        certificat.setValide(true);
        certificat.setStatut(StatutCertificat.ACTIF);
        return certificatRepository.save(certificat);
    }

    public Certificat revoquerCertificat(Long id) {
        Certificat certificat = getCertificatById(id);
        certificat.setStatut(StatutCertificat.REVOQUE);
        certificat.setValide(false);
        return certificatRepository.save(certificat);
    }

    public List<Certificat> getCertificatsApprenant(Long apprenantId) {
        return certificatRepository.findByApprenantId(apprenantId);
    }

    public List<Certificat> getCertificatsActifsApprenant(Long apprenantId) {
        return certificatRepository.findCertificatsActifs(apprenantId);
    }

    public List<Certificat> getCertificatsParFormation(Long formationId) {
        return certificatRepository.findByFormationId(formationId);
    }

    // Vérification de validité
    public Boolean verifierValiditeCertificat(String numeroCertificat) {
        Certificat certificat = getCertificatByNumero(numeroCertificat);
        return certificat.getValide() &&
               certificat.getDateExpiration().isAfter(LocalDate.now()) &&
               certificat.getStatut() == StatutCertificat.ACTIF;
    }

    public byte[] genererPdf(Long id) {
        Certificat cert = getCertificatById(id);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            document.setMargins(40, 40, 40, 40);

            document.add(new Paragraph("CERTIFICAT DE FORMATION")
                    .setFontSize(26).setBold().setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Plateforme de Formations")
                    .setFontSize(14).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            String nomComplet = (cert.getApprenantPrenom() != null ? cert.getApprenantPrenom() + " " : "")
                    + (cert.getApprenantNom() != null ? cert.getApprenantNom() : "Apprenant N°" + cert.getApprenantId());
            document.add(new Paragraph("Ce certificat est délivré à")
                    .setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(nomComplet)
                    .setFontSize(16).setBold().setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));

            String formationTitre = cert.getFormationTitre() != null
                    ? cert.getFormationTitre() : "Formation N°" + cert.getFormationId();
            document.add(new Paragraph("pour avoir suivi avec succès la formation :")
                    .setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(formationTitre)
                    .setFontSize(16).setBold().setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Date d'obtention : " + cert.getDateObtention())
                    .setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Date d'expiration : " + cert.getDateExpiration())
                    .setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Score obtenu : " + (cert.getScoreObtenu() != null ? cert.getScoreObtenu() + "%" : "N/A"))
                    .setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Numéro de certificat : " + cert.getNumeroCertificat())
                    .setFontSize(10).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Statut : " + (cert.getValide() != null && cert.getValide() ? "ACTIF" : "INACTIF"))
                    .setFontSize(12).setBold().setTextAlignment(TextAlignment.CENTER));

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
        return baos.toByteArray();
    }

    // Gestion des modèles
    public List<ModeleDocument> getAllModeles() {
        return modeleDocumentRepository.findAll();
    }

    public ModeleDocument creerModele(ModeleDocument modele) {
        return modeleDocumentRepository.save(modele);
    }

    public ModeleDocument getModeleByType(String type) {
        return modeleDocumentRepository.findByType(type).stream()
                .filter(ModeleDocument::getActif)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Aucun modèle actif trouvé pour le type: " + type));
    }
}

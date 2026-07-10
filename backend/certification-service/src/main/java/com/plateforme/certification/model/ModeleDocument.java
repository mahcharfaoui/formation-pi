package com.plateforme.certification.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "modeles_document")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeleDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String type; // CERTIFICAT, DIPLOME, ATTESTATION

    private String cheminModele; // Chemin vers le template

    @Column(length = 5000)
    private String contenuModele; // Contenu HTML du template

    private Boolean actif = true;
}

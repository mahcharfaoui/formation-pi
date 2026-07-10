package com.plateforme.certification.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"modele", "hibernateLazyInitializer"})
public class Certificat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroCertificat;

    @Column(nullable = false)
    private Long apprenantId;

    @Column(nullable = false)
    private Long formationId;

    private String apprenantNom;

    private String apprenantPrenom;

    private String formationTitre;

    @Column(nullable = false)
    private LocalDate dateObtention;

    @Column(nullable = false)
    private LocalDate dateExpiration;

    @Builder.Default
    private Boolean valide = true;

    private String fichierUrl; // URL du certificat PDF

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutCertificat statut = StatutCertificat.ACTIF;

    private Long sessionFormationId;

    private Double scoreObtenu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modele_id")
    private ModeleDocument modele;
}

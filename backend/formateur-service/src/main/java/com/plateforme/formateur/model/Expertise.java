package com.plateforme.formateur.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "formateur"})
@Table(name = "expertises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expertise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String domaine;

    private String specialite;

    private Integer anneesExperience;

    @Enumerated(EnumType.STRING)
    private NiveauExpertise niveau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formateur_id", nullable = false)
    private Formateur formateur;
}

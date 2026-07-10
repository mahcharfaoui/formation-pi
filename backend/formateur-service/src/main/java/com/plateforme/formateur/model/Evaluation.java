package com.plateforme.formateur.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "formateur"})
@Table(name = "evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer note; // 1 à 5

    @Column(length = 2000)
    private String commentaire;

    private Long apprenantId; // ID de l'apprenant qui évalue

    private Long sessionFormationId; // ID de la session concernée

    private LocalDate dateEvaluation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formateur_id", nullable = false)
    private Formateur formateur;

    @PrePersist
    protected void onCreate() {
        dateEvaluation = LocalDate.now();
    }
}

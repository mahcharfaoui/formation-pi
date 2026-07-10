package com.plateforme.quiz.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "quiz"})
@Table(name = "tentatives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tentative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long apprenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    private Integer score;

    private Integer scoreMax;

    private Boolean reussi;

    private LocalDateTime dateDebut;

    private LocalDateTime dateFin;

    @PrePersist
    protected void onCreate() {
        dateDebut = LocalDateTime.now();
    }
}

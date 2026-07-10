package com.plateforme.quiz.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "quiz")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Long chapitreId; // ID du chapitre concerné

    private Long formationId; // ID de la formation associée

    private Integer dureeMinutes;

    private Integer scoreMinimum; // Score minimum pour réussir

    private Boolean actif = true;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("quiz")
    private List<Question> questions;
}

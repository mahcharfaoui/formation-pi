package com.plateforme.quiz.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "quiz"})
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String enonce;

    @Enumerated(EnumType.STRING)
    private TypeQuestion type; // QCM, VRAI_FALSAIRE, REPONSE_COURTE

    private Integer points;

    @Column(nullable = false)
    private String reponseCorrecte;

    @ElementCollection
    @CollectionTable(name = "choix_proposes")
    private List<String> choixProposes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Transient
    private Long quizId;
}

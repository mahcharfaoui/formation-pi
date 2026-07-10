package com.plateforme.suivi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_lecture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogLecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long apprenantId;

    @Column(nullable = false)
    private Long chapitreId;

    @Column(nullable = false)
    private Long contenuId;

    private Integer dureeSecondes;

    private Integer progressionAvant;

    private Integer progressionApres;

    @Column(nullable = false)
    private LocalDateTime dateLecture;

    @PrePersist
    protected void onCreate() {
        dateLecture = LocalDateTime.now();
    }
}

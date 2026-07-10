package com.plateforme.suivi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progressions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progression {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long apprenantId;

    @Column(nullable = false)
    private Long formationId;

    @Column(nullable = false)
    private Long chapitreId;

    @Column(nullable = false)
    private Integer pourcentage; // 0 à 100

    private Boolean termine = false;

    private LocalDateTime dateDebut;

    private LocalDateTime dateFin;

    private LocalDateTime derniereActivite;

    @PrePersist
    protected void onCreate() {
        dateDebut = LocalDateTime.now();
        derniereActivite = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        derniereActivite = LocalDateTime.now();
        if (pourcentage >= 100) {
            termine = true;
            if (dateFin == null) {
                dateFin = LocalDateTime.now();
            }
        }
    }
}

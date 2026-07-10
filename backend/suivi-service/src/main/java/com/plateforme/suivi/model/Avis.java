package com.plateforme.suivi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "avis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long apprenantId;

    @Column(nullable = false)
    private Long formationId;

    @Column(nullable = false)
    private Integer note; // 1 à 5

    @Column(length = 2000)
    private String commentaire;

    private LocalDate dateAvis;

    @PrePersist
    protected void onCreate() {
        dateAvis = LocalDate.now();
    }
}

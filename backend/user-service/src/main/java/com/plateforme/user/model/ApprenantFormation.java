package com.plateforme.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "apprenant_formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprenantFormation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long apprenantId;

    @Column(nullable = false)
    private Long formationId;

    @Builder.Default
    private LocalDate dateInscription = LocalDate.now();
}

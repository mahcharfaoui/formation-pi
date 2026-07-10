package com.plateforme.certification.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "formations_ref")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationRef {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long formationId; // ID dans le catalogue-service

    @Column(nullable = false)
    private String titre;
}

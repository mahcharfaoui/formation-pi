package com.plateforme.ml.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationInfo {
    private Long id;
    private String titre;
    private String description;
    private String competencesRequises;
    private String niveau;
    private String categorieNom;
    private Double noteMoyenne;
}

package com.plateforme.ml.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetenceInfo {
    private String nom;
    private String categorie;
    private String niveau;
}

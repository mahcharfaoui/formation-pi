package com.plateforme.ml.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommandation {
    private Long formationId;
    private String titre;
    private Double score;
    private String raison;
}

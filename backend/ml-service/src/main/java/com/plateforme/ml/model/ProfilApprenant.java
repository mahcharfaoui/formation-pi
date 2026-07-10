package com.plateforme.ml.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilApprenant {
    private Long apprenantId;
    private String domaine;
    private String niveauActuel;
    private Integer nbFormationsTerminees;
    private Double scoreMoyen;
}

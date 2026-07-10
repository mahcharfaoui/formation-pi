package com.plateforme.ml.model;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilAnalyse {
    private Long apprenantId;
    private String nomComplet;
    private String email;
    private List<CompetenceInfo> competences;
    private int nbCompetences;
    private String domainePrincipal;
    private String niveauEstime;
    private double progressionMoyenne;
    private double scoreQuizMoyen;
    private String quizReussis;
    private int nbFormationsTerminees;
    private int nbFormationsEnCours;
    private List<String> formationsTermineesList;
    private List<String> formationsEnCoursList;
    private Map<String, Object> statsComplementaires;
}

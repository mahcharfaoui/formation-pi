package com.plateforme.ml.service;

import com.plateforme.ml.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommandationService {

    private final WebClient.Builder webClientBuilder;

    private static final double POIDS_COMPETENCES = 0.35;
    private static final double POIDS_NIVEAU = 0.20;
    private static final double POIDS_PROGRESSION = 0.20;
    private static final double POIDS_QUIZ = 0.15;
    private static final double POIDS_SOCIAL = 0.10;

    public ProfilAnalyse analyserProfilComplet(Long apprenantId) {
        List<Map<String, Object>> competences = fetchCompetences(apprenantId);
        List<Map<String, Object>> progressions = fetchProgressions(apprenantId);
        List<Map<String, Object>> tentatives = fetchTentatives(apprenantId);

        List<CompetenceInfo> compList = competences.stream()
                .map(c -> CompetenceInfo.builder()
                        .nom((String) c.get("nom"))
                        .categorie((String) c.get("categorie"))
                        .niveau(c.get("niveau") != null ? c.get("niveau").toString() : "NON_DEFINI")
                        .build())
                .collect(Collectors.toList());

        String domainePrincipal = compList.stream()
                .filter(c -> c.getCategorie() != null)
                .collect(Collectors.groupingBy(CompetenceInfo::getCategorie, Collectors.counting()))
                .entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("Non défini");

        double avgProgression = progressions.stream()
                .mapToInt(p -> (Integer) p.get("pourcentage")).average().orElse(0);
        double avgScore = tentatives.stream()
                .filter(t -> t.get("score") != null)
                .mapToInt(t -> (Integer) t.get("score")).average().orElse(0);
        int totalTentatives = tentatives.size();
        int reussites = (int) tentatives.stream().filter(t -> Boolean.TRUE.equals(t.get("reussi"))).count();

        long formationsTerminees = progressions.stream()
                .filter(p -> Integer.valueOf(100).equals(p.get("pourcentage")) || Boolean.TRUE.equals(p.get("termine")))
                .map(p -> (Number) p.get("formationId")).distinct().count();
        long formationsEnCours = progressions.stream()
                .filter(p -> !Boolean.TRUE.equals(p.get("termine")) && (Integer) p.get("pourcentage") > 0)
                .map(p -> (Number) p.get("formationId")).distinct().count();

        String niveau;

        if (avgProgression > 75 || avgScore > 75) {
            niveau = "Avancé";
        } else if (avgProgression > 40 || avgScore > 40) {
            niveau = "Intermédiaire";
        } else {
            niveau = "Débutant";
        }

        List<String> terminees = progressions.stream()
                .filter(p -> Integer.valueOf(100).equals(p.get("pourcentage")) || Boolean.TRUE.equals(p.get("termine")))
                .map(p -> "Formation #" + p.get("formationId"))
                .distinct().collect(Collectors.toList());

        List<String> enCours = progressions.stream()
                .filter(p -> !Boolean.TRUE.equals(p.get("termine")) && (Integer) p.get("pourcentage") > 0)
                .map(p -> "Formation #" + p.get("formationId"))
                .distinct().collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCompetences", competences.size());
        stats.put("totalProgressions", progressions.size());
        stats.put("totalTentativesQuiz", totalTentatives);
        stats.put("tauxReussiteQuiz", totalTentatives > 0 ? Math.round(reussites * 100.0 / totalTentatives) + "%" : "N/A");
        stats.put("scoreQuizMoyen", Math.round(avgScore * 10) / 10.0);

        return ProfilAnalyse.builder()
                .apprenantId(apprenantId)
                .competences(compList)
                .nbCompetences(compList.size())
                .domainePrincipal(domainePrincipal)
                .niveauEstime(niveau)
                .progressionMoyenne(Math.round(avgProgression * 10) / 10.0)
                .scoreQuizMoyen(Math.round(avgScore * 10) / 10.0)
                .quizReussis(reussites + "/" + totalTentatives)
                .nbFormationsTerminees((int) formationsTerminees)
                .nbFormationsEnCours((int) formationsEnCours)
                .formationsTermineesList(terminees)
                .formationsEnCoursList(enCours)
                .statsComplementaires(stats)
                .build();
    }

    public List<Recommandation> recommanderFormations(ProfilApprenant profil) {
        Long apprenantId = profil.getApprenantId();
        log.info("Recommandations intelligentes pour l'apprenant: {}", apprenantId);

        List<Map<String, Object>> formations = fetchFormations();
        List<Map<String, Object>> competences = fetchCompetences(apprenantId);
        List<Map<String, Object>> progressions = fetchProgressions(apprenantId);
        List<Map<String, Object>> tentatives = fetchTentatives(apprenantId);
        Map<Long, Double> notesFormation = fetchNotesFormations();

        Set<Long> formationsCompletes = progressions.stream()
                .filter(p -> Integer.valueOf(100).equals(p.get("pourcentage")) || Boolean.TRUE.equals(p.get("termine")))
                .map(p -> ((Number) p.get("formationId")).longValue())
                .collect(Collectors.toSet());

        Set<Long> formationsEnCours = progressions.stream()
                .filter(p -> !Boolean.TRUE.equals(p.get("termine")) && (Integer) p.get("pourcentage") > 0)
                .map(p -> ((Number) p.get("formationId")).longValue())
                .collect(Collectors.toSet());

        Set<String> motsCompetences = competences.stream()
                .map(c -> ((String) c.get("nom")).toLowerCase())
                .collect(Collectors.toSet());
        competences.stream()
                .map(c -> (String) c.get("categorie"))
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .forEach(motsCompetences::add);

        Set<String> categoriesCompetences = competences.stream()
                .map(c -> (String) c.get("categorie"))
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        double avgQuizScore = tentatives.stream()
                .filter(t -> t.get("score") != null)
                .mapToInt(t -> (Integer) t.get("score")).average().orElse(0);

        String niveauUtilisateur;
        double progressionMoy = progressions.stream()
                .mapToInt(p -> (Integer) p.get("pourcentage")).average().orElse(0);
        double scoreQuizMoy = tentatives.stream()
                .filter(t -> t.get("score") != null)
                .mapToInt(t -> (Integer) t.get("score")).average().orElse(0);
        if (progressionMoy > 75 || scoreQuizMoy > 75) {
            niveauUtilisateur = "Avancé";
        } else if (progressionMoy > 40 || scoreQuizMoy > 40) {
            niveauUtilisateur = "Intermédiaire";
        } else {
            niveauUtilisateur = "Débutant";
        }

        List<Recommandation> recommandations = new ArrayList<>();

        for (Map<String, Object> formation : formations) {
            Long formationId = ((Number) formation.get("id")).longValue();

            if (formationsCompletes.contains(formationId)) continue;

            String titre = (String) formation.get("titre");
            String req = (String) formation.get("competencesRequises");
            String niveauFormation = formation.get("niveau") != null ? (String) formation.get("niveau") : "Débutant";

            double scoreCompetences = 0;
            double scoreNiveau = 0;
            double scoreProgression = 0;
            double scoreQuiz = 0;
            double scoreSocial = 0;

            // Scoring competence
            if (req != null && !req.isEmpty()) {
                String reqLower = req.toLowerCase();
                String[] motsRequis = reqLower.split("[,\\s]+");
                long matchCount = motsCompetences.stream().filter(reqLower::contains).count();
                int totalMots = motsRequis.length;
                scoreCompetences = totalMots > 0 ? Math.min(100, matchCount * 100.0 / totalMots) : 30;

                // bonus categorie
                boolean categorieMatch = categoriesCompetences.stream().anyMatch(reqLower::contains);
                if (categorieMatch) {
                    scoreCompetences = Math.min(100, scoreCompetences + 15);
                }
            } else {
                scoreCompetences = 50;
            }

            // Scoring niveau
            Map<String, Integer> niveauOrdre = Map.of("Débutant", 1, "Intermédiaire", 2, "Avancé", 3);
            int niveauU = niveauOrdre.getOrDefault(niveauUtilisateur, 1);
            int niveauF = niveauOrdre.getOrDefault(niveauFormation, 1);
            int diff = niveauU - niveauF;
            if (diff == 0) {
                scoreNiveau = 100;
            } else if (diff == 1) {
                scoreNiveau = 60;
            } else if (diff == -1) {
                scoreNiveau = 30;
            } else {
                scoreNiveau = 10;
            }

            // Scoring progression
            if (formationsEnCours.contains(formationId)) {
                Optional<Map<String, Object>> prog = progressions.stream()
                        .filter(p -> ((Number) p.get("formationId")).longValue() == formationId)
                        .findFirst();
                if (prog.isPresent()) {
                    int pct = (Integer) prog.get().get("pourcentage");
                    scoreProgression = pct;
                }
            } else {
                String catFormation = formation.get("categorieNom") != null ? (String) formation.get("categorieNom") : "";
                boolean domaineProche = categoriesCompetences.stream().anyMatch(c -> catFormation.toLowerCase().contains(c) || c.contains(catFormation.toLowerCase()));
                scoreProgression = domaineProche ? 70 : 40;
            }

            // Scoring quiz
            if (avgQuizScore > 0) {
                scoreQuiz = Math.min(100, avgQuizScore);
            } else {
                scoreQuiz = 50;
            }

            // Scoring social
            Double note = notesFormation.get(formationId);
            if (note != null) {
                scoreSocial = Math.min(100, note * 20);
            } else {
                scoreSocial = 50;
            }

            double scoreFinal = scoreCompetences * POIDS_COMPETENCES
                    + scoreNiveau * POIDS_NIVEAU
                    + scoreProgression * POIDS_PROGRESSION
                    + scoreQuiz * POIDS_QUIZ
                    + scoreSocial * POIDS_SOCIAL;

            String raison = construireRaison(scoreCompetences, scoreNiveau, scoreProgression, matchCount(competences, req));

            recommandations.add(Recommandation.builder()
                    .formationId(formationId)
                    .titre(titre)
                    .score(Math.round(scoreFinal * 10) / 10.0)
                    .raison(raison)
                    .build());
        }

        recommandations.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return recommandations.stream().limit(10).collect(Collectors.toList());
    }

    public Map<String, Object> analyserProgression(Long apprenantId) {
        List<Map<String, Object>> progressions = fetchProgressions(apprenantId);
        List<Map<String, Object>> tentatives = fetchTentatives(apprenantId);

        double avgProgression = progressions.stream()
                .mapToInt(p -> (Integer) p.get("pourcentage")).average().orElse(0);
        double avgScore = tentatives.stream()
                .filter(t -> t.get("score") != null)
                .mapToInt(t -> (Integer) t.get("score")).average().orElse(0);
        int totalTentatives = tentatives.size();
        int reussites = (int) tentatives.stream().filter(t -> Boolean.TRUE.equals(t.get("reussi"))).count();

        Map<String, Object> analyse = new HashMap<>();
        analyse.put("apprenantId", apprenantId);
        analyse.put("scoreGeneral", Math.round(avgProgression * 10) / 10.0);
        analyse.put("scoreQuizMoyen", Math.round(avgScore * 10) / 10.0);
        analyse.put("quizReussis", reussites + "/" + totalTentatives);
        analyse.put("progressionMoyenne", Math.round(avgProgression) + "%");
        analyse.put("niveau", avgProgression > 75 ? "Avancé" : avgProgression > 50 ? "Intermédiaire" : "Débutant");
        return analyse;
    }

    private String construireRaison(double scoreComp, double scoreNiveau, double scoreProg, long matchCount) {
        List<String> parts = new ArrayList<>();
        if (matchCount > 0) {
            parts.add(matchCount + " compétence(s) correspondent");
        }
        if (scoreProg > 50) {
            parts.add("déjà commencée (" + Math.round(scoreProg) + "%)");
        }
        if (scoreNiveau > 80) {
            parts.add("niveau adapté");
        } else if (scoreNiveau < 30) {
            parts.add("niveau挑战");
        }
        if (scoreComp < 30 && matchCount == 0) {
            parts.add("nouveau domaine à explorer");
        }
        return parts.isEmpty() ? "Formation recommandée pour votre progression" : String.join(", ", parts);
    }

    private long matchCount(List<Map<String, Object>> competences, String requis) {
        if (requis == null || requis.isEmpty()) return 0;
        String reqLower = requis.toLowerCase();
        return competences.stream()
                .map(c -> ((String) c.get("nom")).toLowerCase())
                .filter(reqLower::contains)
                .count();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchFormations() {
        try {
            return webClientBuilder.build().get()
                    .uri("lb://catalogue-service/api/catalogue/formations")
                    .retrieve()
                    .bodyToMono(List.class)
                    .blockOptional().orElse(List.of());
        } catch (Exception e) {
            log.warn("Impossible de récupérer les formations", e);
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchCompetences(Long apprenantId) {
        try {
            return webClientBuilder.build().get()
                    .uri("lb://user-service/api/users/apprenants/" + apprenantId + "/competences")
                    .retrieve()
                    .bodyToMono(List.class)
                    .blockOptional().orElse(List.of());
        } catch (Exception e) {
            log.warn("Impossible de récupérer les compétences", e);
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchProgressions(Long apprenantId) {
        try {
            return webClientBuilder.build().get()
                    .uri("lb://suivi-service/api/suivi/apprenant/" + apprenantId + "/progressions")
                    .retrieve()
                    .bodyToMono(List.class)
                    .blockOptional().orElse(List.of());
        } catch (Exception e) {
            log.warn("Impossible de récupérer les progressions", e);
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchTentatives(Long apprenantId) {
        try {
            return webClientBuilder.build().get()
                    .uri("lb://quiz-service/api/quiz/apprenant/" + apprenantId + "/tentatives")
                    .retrieve()
                    .bodyToMono(List.class)
                    .blockOptional().orElse(List.of());
        } catch (Exception e) {
            log.warn("Impossible de récupérer les tentatives", e);
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private Map<Long, Double> fetchNotesFormations() {
        try {
            List<Map<String, Object>> avisList = webClientBuilder.build().get()
                    .uri("lb://suivi-service/api/suivi/formations/notes")
                    .retrieve()
                    .bodyToMono(List.class)
                    .blockOptional().orElse(List.of());
            Map<Long, Double> notes = new HashMap<>();
            for (Map<String, Object> entry : avisList) {
                Long formationId = ((Number) entry.get("formationId")).longValue();
                Double noteMoy = entry.get("noteMoyenne") != null ? ((Number) entry.get("noteMoyenne")).doubleValue() : null;
                if (noteMoy != null) notes.put(formationId, noteMoy);
            }
            return notes;
        } catch (Exception e) {
            log.warn("Impossible de récupérer les notes des formations", e);
            return Map.of();
        }
    }
}

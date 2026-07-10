package com.plateforme.suivi.service;

import com.plateforme.suivi.model.*;
import com.plateforme.suivi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SuiviService {

    private final ProgressionRepository progressionRepository;
    private final LogLectureRepository logLectureRepository;
    private final AvisRepository avisRepository;

    // Gestion de la progression
    public List<Progression> getProgressionsApprenant(Long apprenantId) {
        return progressionRepository.findByApprenantId(apprenantId);
    }

    public List<Progression> getProgressionsParFormation(Long apprenantId, Long formationId) {
        return progressionRepository.findByApprenantIdAndFormationId(apprenantId, formationId);
    }

    public Progression mettreAJourProgression(Long apprenantId, Long formationId, Long chapitreId, Integer pourcentage) {
        Progression progression = progressionRepository.findByApprenantIdAndChapitreId(apprenantId, chapitreId);

        if (progression == null) {
            progression = Progression.builder()
                    .apprenantId(apprenantId)
                    .formationId(formationId)
                    .chapitreId(chapitreId)
                    .pourcentage(pourcentage)
                    .build();
        } else {
            progression.setPourcentage(pourcentage);
        }

        return progressionRepository.save(progression);
    }

    public Double getProgressionGlobale(Long apprenantId, Long formationId) {
        Double progression = progressionRepository.calculerProgressionGlobale(apprenantId, formationId);
        return progression != null ? progression : 0.0;
    }

    // Gestion des logs de lecture
    public LogLecture enregistrerLecture(LogLecture logLecture) {
        return logLectureRepository.save(logLecture);
    }

    public List<LogLecture> getLogsApprenant(Long apprenantId) {
        return logLectureRepository.findByApprenantId(apprenantId);
    }

    // Gestion des avis
    public Avis ajouterAvis(Avis avis) {
        return avisRepository.save(avis);
    }

    public List<Avis> getAvisParFormation(Long formationId) {
        return avisRepository.findByFormationId(formationId);
    }

    public Double getNoteMoyenneFormation(Long formationId) {
        Double note = avisRepository.calculerNoteMoyenne(formationId);
        return note != null ? note : 0.0;
    }

    public void supprimerAvis(Long id) {
        avisRepository.deleteById(id);
    }
}

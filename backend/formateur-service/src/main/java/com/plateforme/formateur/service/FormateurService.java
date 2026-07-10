package com.plateforme.formateur.service;

import com.plateforme.formateur.model.*;
import com.plateforme.formateur.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FormateurService {

    private final FormateurRepository formateurRepository;
    private final ExpertiseRepository expertiseRepository;
    private final DisponibiliteRepository disponibiliteRepository;
    private final EvaluationRepository evaluationRepository;

    public List<Formateur> getAllFormateurs() {
        return formateurRepository.findByActifTrue();
    }

    public Formateur getFormateurById(Long id) {
        return formateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé avec l'id: " + id));
    }

    public Formateur creerFormateur(Formateur formateur) {
        return formateurRepository.save(formateur);
    }

    public Formateur mettreAJourFormateur(Long id, Formateur formateurDetails) {
        Formateur formateur = getFormateurById(id);
        formateur.setNom(formateurDetails.getNom());
        formateur.setPrenom(formateurDetails.getPrenom());
        formateur.setEmail(formateurDetails.getEmail());
        formateur.setTelephone(formateurDetails.getTelephone());
        formateur.setCv(formateurDetails.getCv());
        formateur.setTarifHoraire(formateurDetails.getTarifHoraire());
        return formateurRepository.save(formateur);
    }

    public void supprimerFormateur(Long id) {
        Formateur formateur = getFormateurById(id);
        formateur.setActif(false);
        formateurRepository.save(formateur);
    }

    public List<Formateur> rechercheFormateurs(String motCle) {
        return formateurRepository.rechercheParMotCle(motCle);
    }

    // Gestion des expertises
    public List<Expertise> getExpertisesFormateur(Long formateurId) {
        return expertiseRepository.findByFormateurId(formateurId);
    }

    public Expertise ajouterExpertise(Expertise expertise) {
        return expertiseRepository.save(expertise);
    }

    // Gestion des disponibilités
    public List<Disponibilite> getDisponibilitesFormateur(Long formateurId) {
        return disponibiliteRepository.findByFormateurId(formateurId);
    }

    public Disponibilite ajouterDisponibilite(Disponibilite disponibilite) {
        return disponibiliteRepository.save(disponibilite);
    }

    // Gestion des évaluations
    public List<Evaluation> getEvaluationsFormateur(Long formateurId) {
        return evaluationRepository.findByFormateurId(formateurId);
    }

    public Double getNoteMoyenneFormateur(Long formateurId) {
        return evaluationRepository.calculerNoteMoyenne(formateurId);
    }

    public Evaluation ajouterEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }
}

package com.plateforme.user.service;

import com.plateforme.user.model.*;
import com.plateforme.user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final ApprenantRepository apprenantRepository;
    private final CompetenceRepository competenceRepository;

    public List<Apprenant> getAllApprenants() {
        return apprenantRepository.findAll();
    }

    public Apprenant getApprenantById(Long id) {
        return apprenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apprenant non trouvé avec l'id: " + id));
    }

    public Apprenant getApprenantByEmail(String email) {
        return apprenantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Apprenant non trouvé avec l'email: " + email));
    }

    public Apprenant creerApprenant(Apprenant apprenant) {
        return apprenantRepository.save(apprenant);
    }

    public Apprenant mettreAJourApprenant(Long id, Apprenant apprenantDetails) {
        Apprenant apprenant = getApprenantById(id);
        apprenant.setNom(apprenantDetails.getNom());
        apprenant.setPrenom(apprenantDetails.getPrenom());
        apprenant.setEmail(apprenantDetails.getEmail());
        apprenant.setTelephone(apprenantDetails.getTelephone());
        apprenant.setAdresse(apprenantDetails.getAdresse());
        return apprenantRepository.save(apprenant);
    }

    public void supprimerApprenant(Long id) {
        Apprenant apprenant = getApprenantById(id);
        apprenant.setStatut(StatutApprenant.ARCHIVE);
        apprenantRepository.save(apprenant);
    }

    public List<Apprenant> rechercheApprenants(String motCle) {
        return apprenantRepository.rechercheParMotCle(motCle);
    }

    // Gestion des compétences
    public List<Competence> getCompetencesApprenant(Long apprenantId) {
        return competenceRepository.findByApprenantId(apprenantId);
    }

    public Competence ajouterCompetence(Competence competence) {
        return competenceRepository.save(competence);
    }

    public Competence mettreAJourCompetence(Long id, Competence competenceDetails) {
        Competence competence = competenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétence non trouvée avec l'id: " + id));
        competence.setNom(competenceDetails.getNom());
        competence.setNiveau(competenceDetails.getNiveau());
        return competenceRepository.save(competence);
    }

    public void supprimerCompetence(Long id) {
        competenceRepository.deleteById(id);
    }
}

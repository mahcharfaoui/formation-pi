package com.plateforme.catalogue.service;

import com.plateforme.catalogue.model.*;
import com.plateforme.catalogue.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CatalogueService {

    private final FormationRepository formationRepository;
    private final CategorieRepository categorieRepository;
    private final ChapitreRepository chapitreRepository;

    public List<Formation> getAllFormations() {
        return formationRepository.findByActiveTrue();
    }

    public Formation getFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée avec l'id: " + id));
    }

    public Formation creerFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    public Formation mettreAJourFormation(Long id, Formation formationDetails) {
        Formation formation = getFormationById(id);
        formation.setTitre(formationDetails.getTitre());
        formation.setDescription(formationDetails.getDescription());
        formation.setTarif(formationDetails.getTarif());
        formation.setDureeHeures(formationDetails.getDureeHeures());
        formation.setNiveau(formationDetails.getNiveau());
        formation.setCategorie(formationDetails.getCategorie());
        return formationRepository.save(formation);
    }

    public void supprimerFormation(Long id) {
        Formation formation = getFormationById(id);
        formation.setActive(false);
        formationRepository.save(formation);
    }

    public List<Formation> rechercherFormations(String motCle) {
        return formationRepository.rechercheParMotCle(motCle);
    }

    public List<Formation> getFormationsParCategorie(Long categorieId) {
        return formationRepository.findByCategorieId(categorieId);
    }

    public List<Formation> getFormationsParNiveau(String niveau) {
        return formationRepository.findByNiveau(niveau);
    }

    // Gestion des Catégories
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    public Categorie creerCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    // Gestion des Chapitres
    public List<Chapitre> getChapitresParFormation(Long formationId) {
        return chapitreRepository.findByFormationIdOrderByOrdreAsc(formationId);
    }

    public Chapitre ajouterChapitre(Chapitre chapitre) {
        if (chapitre.getFormation() == null || chapitre.getFormation().getId() == null) {
            throw new RuntimeException("La formation est requise");
        }
        chapitre.setFormation(formationRepository.getReferenceById(chapitre.getFormation().getId()));
        return chapitreRepository.save(chapitre);
    }

    public Chapitre mettreAJourChapitre(Long id, Chapitre chapitreDetails) {
        Chapitre chapitre = chapitreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chapitre non trouvé avec l'id: " + id));
        chapitre.setTitre(chapitreDetails.getTitre());
        chapitre.setDescription(chapitreDetails.getDescription());
        chapitre.setOrdre(chapitreDetails.getOrdre());
        chapitre.setDureeMinutes(chapitreDetails.getDureeMinutes());
        return chapitreRepository.save(chapitre);
    }

    public void supprimerChapitre(Long id) {
        chapitreRepository.deleteById(id);
    }
}

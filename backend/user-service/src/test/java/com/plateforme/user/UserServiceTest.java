package com.plateforme.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.plateforme.user.model.*;
import com.plateforme.user.repository.ApprenantRepository;
import com.plateforme.user.repository.CompetenceRepository;
import com.plateforme.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private ApprenantRepository apprenantRepository;

    @Mock
    private CompetenceRepository competenceRepository;

    @InjectMocks
    private UserService userService;

    private Apprenant apprenant;
    private Competence competence;

    @BeforeEach
    void setUp() {
        apprenant = Apprenant.builder()
                .id(1L).nom("Dupont").prenom("Jean")
                .email("jean@test.com").telephone("0102030405")
                .adresse("Paris").statut(StatutApprenant.ACTIF)
                .build();

        competence = Competence.builder()
                .id(1L).nom("Java").niveau(NiveauCompetence.INTERMEDIAIRE)
                .apprenant(apprenant).build();
    }

    @Test
    void getAllApprenantsShouldReturnList() {
        when(apprenantRepository.findAll()).thenReturn(List.of(apprenant));

        List<Apprenant> result = userService.getAllApprenants();

        assertThat(result).hasSize(1);
        verify(apprenantRepository).findAll();
    }

    @Test
    void getApprenantByIdShouldReturnApprenant() {
        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(apprenant));

        Apprenant result = userService.getApprenantById(1L);

        assertThat(result.getNom()).isEqualTo("Dupont");
    }

    @Test
    void getApprenantByIdShouldThrowWhenNotFound() {
        when(apprenantRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getApprenantById(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("non trouvé");
    }

    @Test
    void getApprenantByEmailShouldReturnApprenant() {
        when(apprenantRepository.findByEmail("jean@test.com")).thenReturn(Optional.of(apprenant));

        Apprenant result = userService.getApprenantByEmail("jean@test.com");

        assertThat(result.getEmail()).isEqualTo("jean@test.com");
    }

    @Test
    void getApprenantByEmailShouldThrowWhenNotFound() {
        when(apprenantRepository.findByEmail("inconnu@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getApprenantByEmail("inconnu@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("non trouvé");
    }

    @Test
    void creerApprenantShouldReturnSaved() {
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(apprenant);

        Apprenant result = userService.creerApprenant(apprenant);

        assertThat(result.getNom()).isEqualTo("Dupont");
    }

    @Test
    void mettreAJourApprenantShouldUpdateFields() {
        Apprenant updates = Apprenant.builder()
                .nom("Martin").prenom("Marie").email("marie@test.com")
                .telephone("0600000000").adresse("Lyon").build();

        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(apprenant));
        when(apprenantRepository.save(any(Apprenant.class))).thenAnswer(i -> i.getArgument(0));

        Apprenant result = userService.mettreAJourApprenant(1L, updates);

        assertThat(result.getNom()).isEqualTo("Martin");
        assertThat(result.getPrenom()).isEqualTo("Marie");
        assertThat(result.getEmail()).isEqualTo("marie@test.com");
        assertThat(result.getTelephone()).isEqualTo("0600000000");
        assertThat(result.getAdresse()).isEqualTo("Lyon");
    }

    @Test
    void supprimerApprenantShouldArchive() {
        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(apprenant));
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(apprenant);

        userService.supprimerApprenant(1L);

        assertThat(apprenant.getStatut()).isEqualTo(StatutApprenant.ARCHIVE);
        verify(apprenantRepository).save(apprenant);
    }

    @Test
    void rechercheApprenantsShouldReturnList() {
        when(apprenantRepository.rechercheParMotCle("Jean")).thenReturn(List.of(apprenant));

        List<Apprenant> result = userService.rechercheApprenants("Jean");

        assertThat(result).hasSize(1);
    }

    @Test
    void getCompetencesApprenantShouldReturnList() {
        when(competenceRepository.findByApprenantId(1L)).thenReturn(List.of(competence));

        List<Competence> result = userService.getCompetencesApprenant(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNom()).isEqualTo("Java");
    }

    @Test
    void ajouterCompetenceShouldReturnSaved() {
        when(competenceRepository.save(any(Competence.class))).thenReturn(competence);

        Competence result = userService.ajouterCompetence(competence);

        assertThat(result.getNom()).isEqualTo("Java");
    }

    @Test
    void mettreAJourCompetenceShouldUpdate() {
        Competence updates = Competence.builder().nom("Spring").niveau(NiveauCompetence.EXPERT).build();
        when(competenceRepository.findById(1L)).thenReturn(Optional.of(competence));
        when(competenceRepository.save(any(Competence.class))).thenAnswer(i -> i.getArgument(0));

        Competence result = userService.mettreAJourCompetence(1L, updates);

        assertThat(result.getNom()).isEqualTo("Spring");
        assertThat(result.getNiveau()).isEqualTo(NiveauCompetence.EXPERT);
    }

    @Test
    void mettreAJourCompetenceShouldThrowWhenNotFound() {
        when(competenceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.mettreAJourCompetence(1L, competence))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("non trouvée");
    }

    @Test
    void supprimerCompetenceShouldDelete() {
        doNothing().when(competenceRepository).deleteById(1L);

        userService.supprimerCompetence(1L);

        verify(competenceRepository).deleteById(1L);
    }
}

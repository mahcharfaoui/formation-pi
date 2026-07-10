package com.plateforme.user.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.plateforme.user.model.*;
import com.plateforme.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private Apprenant apprenant;

    @BeforeEach
    void setUp() {
        apprenant = Apprenant.builder()
                .id(1L)
                .nom("Dupont")
                .prenom("Jean")
                .email("jean@test.com")
                .build();
    }

    @Test
    void getAllApprenantsShouldReturnList() {
        when(userService.getAllApprenants()).thenReturn(List.of(apprenant));

        ResponseEntity<List<Apprenant>> response = userController.getAllApprenants();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void getApprenantByIdShouldReturnOk() {
        when(userService.getApprenantById(1L)).thenReturn(apprenant);

        ResponseEntity<Apprenant> response = userController.getApprenantById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNom()).isEqualTo("Dupont");
    }

    @Test
    void getApprenantByEmailShouldReturnOk() {
        when(userService.getApprenantByEmail("jean@test.com")).thenReturn(apprenant);

        ResponseEntity<Apprenant> response = userController.getApprenantByEmail("jean@test.com");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void creerApprenantShouldReturnCreated() {
        when(userService.creerApprenant(any(Apprenant.class))).thenReturn(apprenant);

        ResponseEntity<Apprenant> response = userController.creerApprenant(apprenant);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void mettreAJourApprenantShouldReturnOk() {
        when(userService.mettreAJourApprenant(eq(1L), any(Apprenant.class))).thenReturn(apprenant);

        ResponseEntity<Apprenant> response = userController.mettreAJourApprenant(1L, apprenant);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void supprimerApprenantShouldReturnNoContent() {
        doNothing().when(userService).supprimerApprenant(1L);

        ResponseEntity<Void> response = userController.supprimerApprenant(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void rechercherApprenantsShouldReturnList() {
        when(userService.rechercheApprenants("test")).thenReturn(List.of(apprenant));

        ResponseEntity<List<Apprenant>> response = userController.rechercherApprenants("test");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void getCompetencesShouldReturnList() {
        Competence competence = Competence.builder().id(1L).nom("Java").build();
        when(userService.getCompetencesApprenant(1L)).thenReturn(List.of(competence));

        ResponseEntity<List<Competence>> response = userController.getCompetences(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void ajouterCompetenceShouldReturnCreated() {
        Competence competence = Competence.builder().nom("Java").build();
        when(userService.ajouterCompetence(any(Competence.class))).thenReturn(competence);

        ResponseEntity<Competence> response = userController.ajouterCompetence(competence);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void mettreAJourCompetenceShouldReturnOk() {
        Competence competence = Competence.builder().nom("Java").build();
        when(userService.mettreAJourCompetence(eq(1L), any(Competence.class))).thenReturn(competence);

        ResponseEntity<Competence> response = userController.mettreAJourCompetence(1L, competence);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void supprimerCompetenceShouldReturnNoContent() {
        doNothing().when(userService).supprimerCompetence(1L);

        ResponseEntity<Void> response = userController.supprimerCompetence(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}

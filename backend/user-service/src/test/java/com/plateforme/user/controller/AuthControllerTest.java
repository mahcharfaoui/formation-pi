package com.plateforme.user.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.plateforme.user.dto.*;
import com.plateforme.user.model.*;
import com.plateforme.user.repository.ApprenantFormationRepository;
import com.plateforme.user.repository.CompteUserRepository;
import com.plateforme.user.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private CompteUserRepository compteUserRepository;

    @Mock
    private ApprenantFormationRepository apprenantFormationRepository;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest registerRequest;
    private CompteUserResponse compteUserResponse;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .email("test@test.com").motDePasse("pwd").nom("Test").build();
        compteUserResponse = CompteUserResponse.builder()
                .id(1L).email("test@test.com").nom("Test").build();
    }

    @Test
    void registerShouldReturnCreated() {
        when(authService.register(any(RegisterRequest.class))).thenReturn(compteUserResponse);

        ResponseEntity<?> response = authController.register(registerRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void registerShouldReturnBadRequestOnError() {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email déjà utilisé"));

        ResponseEntity<?> response = authController.register(registerRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void loginShouldReturnOk() {
        LoginResponse loginResponse = LoginResponse.builder().email("test@test.com").token("token123").build();
        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        ResponseEntity<?> response = authController.login(new LoginRequest("test@test.com", "pwd"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void loginShouldReturnBadRequestOnError() {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Email ou mot de passe incorrect"));

        ResponseEntity<?> response = authController.login(new LoginRequest("wrong", "wrong"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getPendingUsersShouldReturnList() {
        when(authService.getPendingUsers()).thenReturn(List.of(compteUserResponse));

        ResponseEntity<List<CompteUserResponse>> response = authController.getPendingUsers();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void getAllUsersShouldReturnList() {
        when(authService.getAllUsers()).thenReturn(List.of(compteUserResponse));

        ResponseEntity<List<CompteUserResponse>> response = authController.getAllUsers();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void approveUserShouldReturnOk() {
        when(authService.approveUser(1L)).thenReturn(compteUserResponse);

        ResponseEntity<?> response = authController.approveUser(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void approveUserShouldReturnBadRequestOnError() {
        when(authService.approveUser(1L))
                .thenThrow(new RuntimeException("Compte non trouvé"));

        ResponseEntity<?> response = authController.approveUser(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void rejectUserShouldReturnOk() {
        when(authService.rejectUser(1L)).thenReturn(compteUserResponse);

        ResponseEntity<CompteUserResponse> response = authController.rejectUser(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getCompteShouldReturnOkWhenFound() {
        CompteUser compte = CompteUser.builder().id(1L).email("test@test.com").build();
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));

        ResponseEntity<?> response = authController.getCompte(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getCompteShouldReturnNotFound() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.getCompte(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void deleteUserShouldReturnNoContent() {
        doNothing().when(compteUserRepository).deleteById(1L);

        ResponseEntity<Void> response = authController.deleteUser(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void getFormationsChoisiesShouldReturnList() {
        ApprenantFormation af = ApprenantFormation.builder()
                .apprenantId(1L).formationId(10L).build();
        when(apprenantFormationRepository.findByApprenantId(1L)).thenReturn(List.of(af));

        ResponseEntity<List<Long>> response = authController.getFormationsChoisies(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactly(10L);
    }

    @Test
    void sauvegarderFormationsChoisiesShouldReturnOk() {
        doNothing().when(apprenantFormationRepository).deleteByApprenantId(1L);
        when(apprenantFormationRepository.save(any(ApprenantFormation.class)))
                .thenReturn(ApprenantFormation.builder().build());

        ResponseEntity<?> response = authController.sauvegarderFormationsChoisies(1L, List.of(10L, 20L));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(apprenantFormationRepository, times(2)).save(any(ApprenantFormation.class));
    }
}

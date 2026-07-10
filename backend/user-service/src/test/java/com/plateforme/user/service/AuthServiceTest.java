package com.plateforme.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.plateforme.user.dto.*;
import com.plateforme.user.model.*;
import com.plateforme.user.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CompteUserRepository compteUserRepository;

    @Mock
    private ApprenantRepository apprenantRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AuthService authService;

    private CompteUser compte;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .email("test@test.com")
                .motDePasse("password123")
                .nom("Dupont")
                .prenom("Jean")
                .role(RoleCompte.ETUDIANT)
                .build();

        compte = CompteUser.builder()
                .id(1L)
                .email("test@test.com")
                .motDePasse("encoded")
                .nom("Dupont")
                .prenom("Jean")
                .role(RoleCompte.ETUDIANT)
                .statut(StatutCompte.PENDING)
                .build();
    }

    @Test
    void registerShouldCreateAccount() {
        when(compteUserRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);

        CompteUserResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("test@test.com");
        verify(compteUserRepository).save(any(CompteUser.class));
    }

    @Test
    void registerShouldThrowWhenEmailExists() {
        when(compteUserRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("déjà utilisé");
    }

    @Test
    void loginShouldSucceed() {
        compte.setStatut(StatutCompte.APPROVED);
        when(compteUserRepository.findByEmail(anyString())).thenReturn(Optional.of(compte));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        LoginResponse response = authService.login(new LoginRequest("test@test.com", "password123"));

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("test@test.com");
        assertThat(response.getToken()).isNotNull();
    }

    @Test
    void loginShouldThrowWhenEmailNotFound() {
        when(compteUserRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("wrong@test.com", "pwd")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("incorrect");
    }

    @Test
    void loginShouldThrowWhenWrongPassword() {
        when(compteUserRepository.findByEmail(anyString())).thenReturn(Optional.of(compte));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("test@test.com", "wrong")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("incorrect");
    }

    @Test
    void loginShouldThrowWhenPending() {
        when(compteUserRepository.findByEmail(anyString())).thenReturn(Optional.of(compte));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(new LoginRequest("test@test.com", "password123")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("attente d'approbation");
    }

    @Test
    void loginShouldThrowWhenRejected() {
        compte.setStatut(StatutCompte.REJECTED);
        when(compteUserRepository.findByEmail(anyString())).thenReturn(Optional.of(compte));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(new LoginRequest("test@test.com", "password123")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("refusé");
    }

    @Test
    void getPendingUsersShouldReturnList() {
        when(compteUserRepository.findByStatut(StatutCompte.PENDING)).thenReturn(List.of(compte));

        List<CompteUserResponse> users = authService.getPendingUsers();

        assertThat(users).hasSize(1);
    }

    @Test
    void getAllUsersShouldReturnList() {
        when(compteUserRepository.findAll()).thenReturn(List.of(compte));

        List<CompteUserResponse> users = authService.getAllUsers();

        assertThat(users).hasSize(1);
    }

    @Test
    void approveUserShouldSetApproved() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);

        CompteUserResponse response = authService.approveUser(1L);

        assertThat(response.getStatut()).isEqualTo(StatutCompte.APPROVED);
    }

    @Test
    void approveUserShouldCreateApprenantForEtudiant() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);
        when(apprenantRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(null);

        authService.approveUser(1L);

        verify(apprenantRepository).save(any(Apprenant.class));
    }

    @Test
    void approveUserShouldNotDuplicateApprenant() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);
        when(apprenantRepository.findByEmail(anyString())).thenReturn(Optional.of(new Apprenant()));

        authService.approveUser(1L);

        verify(apprenantRepository, never()).save(any(Apprenant.class));
    }

    @Test
    void approveUserShouldCallFormateurService() {
        compte.setRole(RoleCompte.FORMATEUR);
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);
        when(restTemplate.postForObject(anyString(), any(), eq(Void.class))).thenReturn(null);

        authService.approveUser(1L);

        verify(restTemplate).postForObject(anyString(), any(), eq(Void.class));
    }

    @Test
    void approveUserShouldHandleFormateurServiceError() {
        compte.setRole(RoleCompte.FORMATEUR);
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);
        when(restTemplate.postForObject(anyString(), any(), eq(Void.class)))
                .thenThrow(new RuntimeException("Service down"));

        authService.approveUser(1L);

        verify(compteUserRepository, times(1)).save(any(CompteUser.class));
    }

    @Test
    void approveUserShouldThrowWhenNotFound() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.approveUser(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("non trouvé");
    }

    @Test
    void rejectUserShouldSetRejected() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.of(compte));
        when(compteUserRepository.save(any(CompteUser.class))).thenReturn(compte);

        CompteUserResponse response = authService.rejectUser(1L);

        assertThat(response.getStatut()).isEqualTo(StatutCompte.REJECTED);
    }

    @Test
    void rejectUserShouldThrowWhenNotFound() {
        when(compteUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.rejectUser(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("non trouvé");
    }
}

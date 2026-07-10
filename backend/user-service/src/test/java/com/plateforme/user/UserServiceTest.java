package com.plateforme.user;

import com.plateforme.user.model.Apprenant;
import com.plateforme.user.repository.ApprenantRepository;
import com.plateforme.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private ApprenantRepository apprenantRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetAllApprenants() {
        Apprenant a1 = Apprenant.builder().id(1L).nom("Dupont").prenom("Jean").build();
        Apprenant a2 = Apprenant.builder().id(2L).nom("Martin").prenom("Marie").build();
        when(apprenantRepository.findAll()).thenReturn(Arrays.asList(a1, a2));

        List<Apprenant> apprenants = userService.getAllApprenants();

        assertEquals(2, apprenants.size());
        verify(apprenantRepository, times(1)).findAll();
    }

    @Test
    void testGetApprenantById() {
        Apprenant a = Apprenant.builder().id(1L).nom("Dupont").build();
        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(a));

        Apprenant result = userService.getApprenantById(1L);

        assertNotNull(result);
        assertEquals("Dupont", result.getNom());
    }

    @Test
    void testCreerApprenant() {
        Apprenant a = Apprenant.builder().nom("Test").prenom("User").email("test@test.com").build();
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(a);

        Apprenant result = userService.creerApprenant(a);

        assertNotNull(result);
        assertEquals("Test", result.getNom());
    }
}

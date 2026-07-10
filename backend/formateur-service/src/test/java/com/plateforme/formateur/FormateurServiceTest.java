package com.plateforme.formateur;

import com.plateforme.formateur.model.Formateur;
import com.plateforme.formateur.repository.FormateurRepository;
import com.plateforme.formateur.service.FormateurService;
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
class FormateurServiceTest {

    @Mock
    private FormateurRepository formateurRepository;

    @InjectMocks
    private FormateurService formateurService;

    @Test
    void testGetAllFormateurs() {
        Formateur f1 = Formateur.builder().id(1L).nom("Dupont").build();
        Formateur f2 = Formateur.builder().id(2L).nom("Martin").build();
        when(formateurRepository.findByActifTrue()).thenReturn(Arrays.asList(f1, f2));

        List<Formateur> formateurs = formateurService.getAllFormateurs();

        assertEquals(2, formateurs.size());
        verify(formateurRepository, times(1)).findByActifTrue();
    }

    @Test
    void testGetFormateurById() {
        Formateur f = Formateur.builder().id(1L).nom("Dupont").build();
        when(formateurRepository.findById(1L)).thenReturn(Optional.of(f));

        Formateur result = formateurService.getFormateurById(1L);

        assertNotNull(result);
        assertEquals("Dupont", result.getNom());
    }

    @Test
    void testCreerFormateur() {
        Formateur f = Formateur.builder().nom("Test").prenom("Formateur").email("test@test.com").build();
        when(formateurRepository.save(any(Formateur.class))).thenReturn(f);

        Formateur result = formateurService.creerFormateur(f);

        assertNotNull(result);
        assertEquals("Test", result.getNom());
    }
}

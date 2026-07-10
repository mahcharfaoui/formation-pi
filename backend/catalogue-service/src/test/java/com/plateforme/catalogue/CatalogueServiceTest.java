package com.plateforme.catalogue;

import com.plateforme.catalogue.model.Formation;
import com.plateforme.catalogue.repository.FormationRepository;
import com.plateforme.catalogue.service.CatalogueService;
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
class CatalogueServiceTest {

    @Mock
    private FormationRepository formationRepository;

    @InjectMocks
    private CatalogueService catalogueService;

    @Test
    void testGetAllFormations() {
        Formation f1 = Formation.builder().id(1L).titre("Java").build();
        Formation f2 = Formation.builder().id(2L).titre("Spring").build();
        when(formationRepository.findByActiveTrue()).thenReturn(Arrays.asList(f1, f2));

        List<Formation> formations = catalogueService.getAllFormations();

        assertEquals(2, formations.size());
        verify(formationRepository, times(1)).findByActiveTrue();
    }

    @Test
    void testGetFormationById() {
        Formation f = Formation.builder().id(1L).titre("Java").build();
        when(formationRepository.findById(1L)).thenReturn(Optional.of(f));

        Formation result = catalogueService.getFormationById(1L);

        assertNotNull(result);
        assertEquals("Java", result.getTitre());
    }

    @Test
    void testCreerFormation() {
        Formation f = Formation.builder().titre("Python").tarif(100.0).build();
        when(formationRepository.save(any(Formation.class))).thenReturn(f);

        Formation result = catalogueService.creerFormation(f);

        assertNotNull(result);
        assertEquals("Python", result.getTitre());
        verify(formationRepository, times(1)).save(any(Formation.class));
    }
}

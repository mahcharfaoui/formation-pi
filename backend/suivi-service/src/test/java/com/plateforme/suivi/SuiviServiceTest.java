package com.plateforme.suivi;

import com.plateforme.suivi.model.Progression;
import com.plateforme.suivi.repository.ProgressionRepository;
import com.plateforme.suivi.service.SuiviService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SuiviServiceTest {

    @Mock
    private ProgressionRepository progressionRepository;

    @InjectMocks
    private SuiviService suiviService;

    @Test
    void testGetProgressionsApprenant() {
        Progression p1 = Progression.builder().id(1L).apprenantId(1L).pourcentage(50).build();
        Progression p2 = Progression.builder().id(2L).apprenantId(1L).pourcentage(75).build();
        when(progressionRepository.findByApprenantId(1L)).thenReturn(Arrays.asList(p1, p2));

        List<Progression> progressions = suiviService.getProgressionsApprenant(1L);

        assertEquals(2, progressions.size());
        verify(progressionRepository, times(1)).findByApprenantId(1L);
    }

    @Test
    void testMettreAJourProgression() {
        Progression p = Progression.builder().apprenantId(1L).chapitreId(1L).pourcentage(100).build();
        when(progressionRepository.findByApprenantIdAndChapitreId(1L, 1L)).thenReturn(null);
        when(progressionRepository.save(any(Progression.class))).thenReturn(p);

        Progression result = suiviService.mettreAJourProgression(1L, 1L, 1L, 100);

        assertNotNull(result);
        assertEquals(100, result.getPourcentage());
    }
}

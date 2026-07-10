package com.plateforme.ml;

import com.plateforme.ml.model.ProfilApprenant;
import com.plateforme.ml.model.Recommandation;
import com.plateforme.ml.service.RecommandationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MlServiceTest {

    @InjectMocks
    private RecommandationService recommandationService;

    @Test
    void testRecommanderFormations() {
        ProfilApprenant profil = ProfilApprenant.builder()
                .apprenantId(1L)
                .domaine("IT")
                .niveauActuel("DEBUTANT")
                .build();

        List<Recommandation> recommandations = recommandationService.recommanderFormations(profil);

        assertNotNull(recommandations);
        assertFalse(recommandations.isEmpty());
        assertTrue(recommandations.size() > 0);
    }

    @Test
    void testAnalyserProgression() {
        var resultat = recommandationService.analyserProgression(1L);

        assertNotNull(resultat);
        assertEquals(1L, resultat.get("apprenantId"));
        assertNotNull(resultat.get("scoreGeneral"));
    }
}

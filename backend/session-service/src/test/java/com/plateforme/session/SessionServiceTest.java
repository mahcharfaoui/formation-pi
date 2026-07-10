package com.plateforme.session;

import com.plateforme.session.model.SessionFormation;
import com.plateforme.session.repository.SessionFormationRepository;
import com.plateforme.session.service.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionFormationRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void testGetAllSessions() {
        SessionFormation s1 = SessionFormation.builder().id(1L).formationIds(Collections.singletonList(1L)).build();
        SessionFormation s2 = SessionFormation.builder().id(2L).formationIds(Collections.singletonList(2L)).build();
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<SessionFormation> sessions = sessionService.getAllSessions();

        assertEquals(2, sessions.size());
    }

    @Test
    void testCreerSession() {
        SessionFormation s = SessionFormation.builder()
                .formationIds(Collections.singletonList(1L))
                .dateDebut(LocalDate.now().plusDays(7))
                .dateFin(LocalDate.now().plusDays(14))
                .capaciteMax(30)
                .build();
        when(sessionRepository.save(any(SessionFormation.class))).thenReturn(s);

        SessionFormation result = sessionService.creerSession(s);

        assertNotNull(result);
        assertTrue(result.getFormationIds().contains(1L));
    }
}

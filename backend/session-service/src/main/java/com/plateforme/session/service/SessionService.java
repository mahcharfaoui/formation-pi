package com.plateforme.session.service;

import com.plateforme.session.model.*;
import com.plateforme.session.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SessionService {

    private final SessionFormationRepository sessionRepository;
    private final InscriptionRepository inscriptionRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate;

    public List<SessionFormation> getAllSessions() {
        return sessionRepository.findAll();
    }

    public SessionFormation getSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session non trouvée avec l'id: " + id));
    }

    public SessionFormation creerSession(SessionFormation session) {
        SessionFormation saved = sessionRepository.save(session);
        if (saved.getFormateurId() != null) {
            envoyerEmailAffectation(saved);
        }
        return saved;
    }

    public SessionFormation mettreAJourSession(Long id, SessionFormation sessionDetails) {
        SessionFormation session = getSessionById(id);
        Long ancienFormateurId = session.getFormateurId();
        session.setDateDebut(sessionDetails.getDateDebut());
        session.setDateFin(sessionDetails.getDateFin());
        session.setCapaciteMax(sessionDetails.getCapaciteMax());
        session.setStatut(sessionDetails.getStatut());
        session.setLieu(sessionDetails.getLieu());
        session.setEnLigne(sessionDetails.getEnLigne());
        if (sessionDetails.getFormationIds() != null) {
            session.setFormationIds(sessionDetails.getFormationIds());
        }
        if (sessionDetails.getFormateurId() != null) {
            session.setFormateurId(sessionDetails.getFormateurId());
        }
        SessionFormation saved = sessionRepository.save(session);
        if (sessionDetails.getFormateurId() != null && !sessionDetails.getFormateurId().equals(ancienFormateurId)) {
            envoyerEmailAffectation(saved);
        }
        return saved;
    }

    public void supprimerSession(Long id) {
        SessionFormation session = getSessionById(id);
        inscriptionRepository.deleteBySessionId(id);
        sessionRepository.delete(session);
    }

    public List<SessionFormation> getSessionsParFormation(Long formationId) {
        return sessionRepository.findByFormationIdsContaining(formationId);
    }

    public List<SessionFormation> getSessionsParFormateur(Long formateurId) {
        return sessionRepository.findByFormateurId(formateurId);
    }

    // Gestion des inscriptions
    public Inscription inscrireApprenant(Long sessionId, Long apprenantId) {
        SessionFormation session = getSessionById(sessionId);

        if (inscriptionRepository.existsByApprenantIdAndSessionId(apprenantId, sessionId)) {
            throw new RuntimeException("L'apprenant est déjà inscrit à cette session");
        }

        if (session.getParticipantsActuels() >= session.getCapaciteMax()) {
            throw new RuntimeException("La session est complète");
        }

        Inscription inscription = Inscription.builder()
                .apprenantId(apprenantId)
                .session(session)
                .statut(StatutInscription.CONFIRMEE)
                .build();

        session.setParticipantsActuels(session.getParticipantsActuels() + 1);
        sessionRepository.save(session);

        return inscriptionRepository.save(inscription);
    }

    public void annulerInscription(Long inscriptionId) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        inscription.setStatut(StatutInscription.ANNULEE);
        inscriptionRepository.save(inscription);

        SessionFormation session = inscription.getSession();
        session.setParticipantsActuels(session.getParticipantsActuels() - 1);
        sessionRepository.save(session);
    }

    public List<Inscription> getInscriptionsParSession(Long sessionId) {
        return inscriptionRepository.findBySessionId(sessionId);
    }

    public List<Inscription> getInscriptionsParApprenant(Long apprenantId) {
        return inscriptionRepository.findByApprenantId(apprenantId);
    }

    private void envoyerEmailAffectation(SessionFormation session) {
        try {
            Map<String, Object> formateur = restTemplate.getForObject(
                    "http://localhost:8083/api/formateurs/{id}", Map.class, session.getFormateurId());
            if (formateur == null || formateur.get("email") == null) return;

            String formationsStr = "";
            if (session.getFormationIds() != null && !session.getFormationIds().isEmpty()) {
                formationsStr = session.getFormationIds().stream()
                        .map(fid -> {
                            try {
                                Map<String, Object> f = restTemplate.getForObject(
                                        "http://localhost:8082/api/catalogue/formations/{id}", Map.class, fid);
                                return f != null ? (String) f.get("titre") : "Formation #" + fid;
                            } catch (Exception e) {
                                return "Formation #" + fid;
                            }
                        })
                        .collect(Collectors.joining(", "));
            }

            emailService.envoyerNotificationAffectation(
                    (String) formateur.get("email"),
                    (String) formateur.get("nom"),
                    (String) formateur.get("prenom"),
                    formationsStr,
                    session.getDateDebut() != null ? session.getDateDebut().toString() : "",
                    session.getDateFin() != null ? session.getDateFin().toString() : "",
                    session.getLieu(),
                    session.getEnLigne() != null && session.getEnLigne()
            );
        } catch (Exception e) {
            log.warn("Impossible d'envoyer l'email au formateur {} : {}", session.getFormateurId(), e.getMessage());
        }
    }
}

package com.plateforme.session.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void envoyerNotificationAffectation(
            String destinataire,
            String nomFormateur,
            String prenomFormateur,
            String titreFormation,
            String dateDebut,
            String dateFin,
            String lieu,
            boolean enLigne
    ) {
        String sujet = "Affectation à une session de formation";
        String corps = construireCorpsEmail(nomFormateur, prenomFormateur, titreFormation, dateDebut, dateFin, lieu, enLigne);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(destinataire);
            helper.setSubject(sujet);
            helper.setText(corps, true);
            mailSender.send(message);
            log.info("Email envoyé à {} pour l'affectation à la session {}", destinataire, titreFormation);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email à {} : {}", destinataire, e.getMessage());
        }
    }

    private String construireCorpsEmail(
            String nom, String prenom, String formation,
            String dateDebut, String dateFin, String lieu, boolean enLigne
    ) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="background: #3f51b5; color: white; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Plateforme de Formations</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Bonjour <strong>%s %s</strong>,</p>
                        <p>Vous avez été affecté(e) à la session de formation suivante :</p>
                        <table style="width: 100%%; border-collapse: collapse; margin: 16px 0;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold; width: 120px;">Formation</td>
                                <td style="padding: 8px; border: 1px solid #e0e0e0;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Date début</td>
                                <td style="padding: 8px; border: 1px solid #e0e0e0;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Date fin</td>
                                <td style="padding: 8px; border: 1px solid #e0e0e0;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Lieu</td>
                                <td style="padding: 8px; border: 1px solid #e0e0e0;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Type</td>
                                <td style="padding: 8px; border: 1px solid #e0e0e0;">%s</td>
                            </tr>
                        </table>
                        <p>Veuillez vous préparer pour assurer cette formation dans les meilleures conditions.</p>
                        <p>Cordialement,<br><strong>L'équipe pédagogique</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(prenom, nom, formation, dateDebut, dateFin,
                    lieu != null ? lieu : "Non précisé",
                    enLigne ? "En ligne" : "Présentiel");
    }
}

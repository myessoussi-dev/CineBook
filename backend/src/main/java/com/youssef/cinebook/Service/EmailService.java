package com.youssef.cinebook.Service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.UrlResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private static final String TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    private static final String email = "EMAIL";
    private static final String name = "CinéBook";

    @Async
    public void envoyerConfirmationReservation(
            String destinataire,
            String nomUtilisateur,
            String film,
            String posterPath,
            String date,
            String heure,
            String salle,
            String siegesBadges,  // ← déjà construit en HTML
            String prix,
            Long numeroReservation
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(email, name);
            helper.setTo(destinataire);
            helper.setSubject("🎬 Confirmation de votre réservation - " + film);
            helper.setText(construireHtml(
                    nomUtilisateur, film, date, heure, salle, siegesBadges, prix, numeroReservation
            ), true);

            String posterFullUrl = TMDB_IMAGE_BASE_URL + posterPath;
            helper.addInline("poster", new UrlResource(new URI(posterFullUrl)));

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du mail de confirmation", e);
        }
    }

    private String construireHtml(
            String nomUtilisateur,
            String film,
            String date,
            String heure,
            String salle,
            String siegesBadges,
            String prix,
            Long numeroReservation
    ) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #1a1a2e, #e94560); padding: 30px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
                .header p { margin: 5px 0 0; opacity: 0.85; font-size: 14px; }
                .poster { text-align: center; padding: 20px; background: #1a1a2e; }
                .poster img { width: 160px; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
                .body { padding: 30px; color: #333; }
                .body h2 { color: #1a1a2e; margin-bottom: 20px; }
                .detail-box { background: #f9f9f9; border-left: 4px solid #e94560; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
                .detail-row:last-child { border-bottom: none; }
                .detail-label { color: #666; font-size: 14px; }
                .total { font-weight: bold; color: #e94560; font-size: 16px; }
                .reservation-num { background: #1a1a2e; color: white; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 18px; letter-spacing: 3px; }
                .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
                .footer a { color: #e94560; text-decoration: none; }
                .warning { background: #fff8e1; border-left: 4px solid #ffc107; padding: 10px 15px; border-radius: 6px; font-size: 13px; color: #666; margin-top: 15px; }
              </style>
            </head>
            <body>
              <div class="container">

                <div class="header">
                  <h1>🎬 CinéBook</h1>
                  <p>Votre billet de cinéma numérique</p>
                </div>

                <div class="poster">
                  <img src="cid:poster" alt="Poster %s" />
                </div>

                <div class="body">
                  <h2>Bonjour %s,</h2>
                  <p>Votre réservation est <strong style="color:#e94560;">confirmée</strong> ! Voici votre récapitulatif :</p>

                  <div class="detail-box">
                    <div class="detail-row">
                      <span class="detail-label">🎥 Film</span>
                      <span><strong>%s</strong></span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">📅 Date</span>
                      <span>%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">⏰ Séance</span>
                      <span>%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">🏛️ Salle</span>
                      <span>%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">💺 Siège(s)</span>
                      <div style="text-align:right;">%s</div>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">💳 Total payé</span>
                      <span class="total">%s TND</span>
                    </div>
                  </div>

                  <div class="reservation-num">
                    🎟️ N° %s
                  </div>

                  <div class="warning">
                    ⚠️ Présentez ce mail ou votre numéro de réservation à l'entrée. Merci d'arriver <strong>10 minutes avant</strong> la séance.
                  </div>
                </div>

                <div class="footer">
                  <p>© 2026 CinéBook • <a href="#">Politique de confidentialité</a> • <a href="#">Support</a></p>
                  <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>

              </div>
            </body>
            </html>
        """.formatted(
                film,               // alt poster
                nomUtilisateur,     // Bonjour
                film,               // nom film
                date,               // date
                heure,              // séance
                salle,              // salle
                siegesBadges,       // sièges badges
                prix,               // total
                numeroReservation   // numéro réservation
        );
    }
}
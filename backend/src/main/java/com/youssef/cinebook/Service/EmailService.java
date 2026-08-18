package com.youssef.cinebook.Service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${MAIL}")
    private String email;
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
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); border: 1px solid #2a2a2a; }
                .header { background: linear-gradient(135deg, #1a1a1a 0%%, #2a2a2a 100%%); padding: 50px 30px; text-align: center; border-bottom: 3px solid #f4a000; }
                .header h1 { margin: 0; font-size: 36px; font-weight: 800; color: #f4a000; letter-spacing: -1px; }
                .header p { margin: 10px 0 0; color: #999; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
                .poster { text-align: center; padding: 30px; background: #0f0f0f; }
                .poster img { width: 150px; border-radius: 8px; box-shadow: 0 8px 24px rgba(244, 160, 0, 0.3); border: 2px solid #f4a000; }
                .body { padding: 40px 30px; color: #ddd; }
                .greeting { font-size: 16px; margin-bottom: 35px; line-height: 1.6; }
                .greeting strong { color: #f4a000; font-weight: 700; }
                .detail-box { background: #252525; border-radius: 8px; padding: 0; margin: 30px 0; overflow: hidden; border: 1px solid #333; }
                .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #2a2a2a; font-size: 14px; }
                .detail-row:last-child { border-bottom: none; }
                .detail-label { color: #999; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                .detail-value { color: #fff; font-weight: 600; }
                .total-row { background: linear-gradient(90deg, #f4a000 0%%, #d99000 100%%); padding: 18px 20px !important; border-bottom: none !important; }
                .total-label { color: #000; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-size: 13px; }
                .total-value { color: #000; font-size: 18px; font-weight: 800; }
                .reservation-section { margin: 35px 0; }
                .reservation-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
                .reservation-num { background: #f4a000; color: #000; text-align: center; padding: 25px; border-radius: 8px; font-size: 24px; font-weight: 800; letter-spacing: 3px; box-shadow: 0 6px 20px rgba(244, 160, 0, 0.4); }
                .info-section { background: #252525; border-left: 4px solid #f4a000; padding: 16px 18px; border-radius: 6px; font-size: 13px; color: #ccc; line-height: 1.8; margin-top: 30px; }
                .info-section strong { color: #f4a000; }
                .footer { background: #0f0f0f; color: #666; text-align: center; padding: 30px; font-size: 12px; border-top: 1px solid #2a2a2a; }
                .footer a { color: #f4a000; text-decoration: none; font-weight: 600; }
                .footer p { margin: 6px 0; }
              </style>
            </head>
            <body>
              <div class="container">

                <div class="header">
                  <h1>CinéBook</h1>
                  <p>Confirmation de réservation</p>
                </div>

                <div class="poster">
                  <img src="cid:poster" alt="Poster %s" />
                </div>

                <div class="body">
                  <div class="greeting">
                    Bonjour <strong>%s</strong>,<br>
                    Votre réservation est <strong>confirmée</strong> !
                  </div>

                  <div class="detail-box">
                    <div class="detail-row">
                      <span class="detail-label">Film</span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Date</span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Séance</span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Salle</span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Siège(s)</span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row total-row">
                      <span class="total-label">Total à payer</span>
                      <span class="total-value">%s TND</span>
                    </div>
                  </div>

                  <div class="reservation-section">
                    <div class="reservation-label">Numéro de réservation</div>
                    <div class="reservation-num">%s</div>
                  </div>

                  <div class="info-section">
                    Présentez ce numéro ou ce mail à l'entrée. Arrivez <strong>10 minutes avant</strong> la séance pour un meilleur accueil.
                  </div>
                </div>

                <div class="footer">
                  <p>© 2026 CinéBook • <a href="#">Politique de confidentialité</a> • <a href="#">Support</a></p>
                  <p style="color: #555; margin-top: 12px;">Cet email a été envoyé automatiquement.</p>
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
                siegesBadges,       // sièges
                prix,               // total
                numeroReservation   // numéro réservation
        );
    }
}
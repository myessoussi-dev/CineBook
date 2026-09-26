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
    private String mail;
    private static final String name = "CinéBook";

    @Async
    public void sendOtpEmail(String email, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mail, name);
            helper.setTo(email);
            helper.setSubject("🔐 Votre code de vérification CinéBook");
            helper.setText(buildOtpHtml(otpCode), true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du mail OTP", e);
        }
    }

    private String buildOtpHtml(String otpCode) {
        StringBuilder digits = new StringBuilder();
        for (char c : otpCode.toCharArray()) {
            digits.append("""
                <span style="
                    display: inline-block;
                    width: 36px;
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    font-size: 22px;
                    font-weight: 700;
                    color: #111827;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 8px;
                    margin: 0 3px;
                    font-family: monospace;
                ">%c</span>
            """.formatted(c));
        }

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background:#f3f4f6; font-family: Arial, sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="padding: 48px 20px;">
                <tr><td align="center">
                  <table cellpadding="0" cellspacing="0" style="
                      background: #ffffff;
                      border-radius: 12px;
                      border: 1px solid #e5e7eb;
                      max-width: 480px;
                      width: 100%%;
                  ">
                    <tr>
                      <td style="padding: 40px 40px 32px;">
                        <p style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: #111827;">
                          CinéBook
                        </p>
                        <p style="margin: 0 0 8px; font-size: 15px; color: #111827; font-weight: 600;">
                          Vérifiez votre adresse email
                        </p>
                        <p style="margin: 0 0 28px; font-size: 14px; color: #6b7280; line-height: 1.6;">
                          Entrez ce code pour confirmer votre compte. Il expire dans <strong>5 minutes</strong>.
                        </p>
                        <!-- digits container: white-space:nowrap keeps all boxes on one line on mobile -->
                        <div style="text-align: center; margin-bottom: 28px; white-space: nowrap;">
                          %s
                        </div>
                        <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                          Si vous n'avez pas créé de compte, ignorez cet email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; border-top: 1px solid #f3f4f6;">
                        <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                          © 2026 CinéBook — Ne pas répondre à cet email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
        """.formatted(digits.toString());
    }

    // ─── Reservation Confirmation Email ───────────────────────────

    @Async
    public void sendConfirmationEmail(String email, String clientName, String movieTitle,
                                      String posterPath, String sessionDate, String sessionTime,
                                      String roomName, String seats, String totalPrice,
                                      String numeroReservation) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mail, name);
            helper.setTo(email);
            helper.setSubject("🎟 Votre réservation CinéBook — " + movieTitle);
            helper.setText(buildConfirmationHtml(clientName, movieTitle, posterPath,
                    sessionDate, sessionTime, roomName, seats, totalPrice,
                    numeroReservation), true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du mail de confirmation", e);
        }
    }

    private String buildConfirmationHtml(String clientName, String movieTitle,
                                         String posterPath, String sessionDate, String sessionTime,
                                         String roomName, String seats, String totalPrice,
                                         String numeroReservation) {
        String posterBlock = (posterPath != null && !posterPath.isBlank())
                ? "<img src=\"https://image.tmdb.org/t/p/w200" + posterPath + "\" alt=\"\" " +
                "style=\"width:64px; height:96px; object-fit:cover; border-radius:6px; " +
                "border:1px solid #e5e7eb; vertical-align:top;\" />"
                : "";
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background:#f3f4f6; font-family: Arial, sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="padding: 48px 20px;">
                <tr><td align="center">
                  <table cellpadding="0" cellspacing="0" style="
                      background: #ffffff;
                      border-radius: 12px;
                      border: 1px solid #e5e7eb;
                      max-width: 480px;
                      width: 100%%;
                  ">
 
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 28px;">
                        <p style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: #111827;">
                          CinéBook
                        </p>
                        <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #111827;">
                          Réservation confirmée ✓
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                          Bonjour <strong>%s</strong>, votre place est réservée. À tout à l'heure au cinéma&nbsp;!
                        </p>
                      </td>
                    </tr>
 
                    <!-- Divider -->
                    <tr><td style="padding: 0 40px;"><div style="height:1px; background:#f3f4f6;"></div></td></tr>
 
                    <!-- Film row: poster + title/infos -->
                    <tr>
                      <td style="padding: 28px 40px 20px;">
                        <table width="100%%" cellpadding="0" cellspacing="0">
                          <tr>
                            <!-- Poster -->
                            <td style="width: 72px; vertical-align: top; padding-right: 18px;">
                              %s
                            </td>
                            <!-- Film details -->
                            <td style="vertical-align: top;">
                              <p style="margin: 0 0 3px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Film</p>
                              <p style="margin: 0 0 14px; font-size: 16px; font-weight: 700; color: #111827;">%s</p>
 
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-bottom: 10px; width: 50%%;">
                                    <p style="margin: 0 0 2px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">%s</p>
                                  </td>
                                  <td style="padding-bottom: 10px; width: 50%%;">
                                    <p style="margin: 0 0 2px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Heure</p>
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">%s</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="width: 50%%;">
                                    <p style="margin: 0 0 2px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Salle</p>
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">%s</p>
                                  </td>
                                  <td style="width: 50%%;">
                                    <p style="margin: 0 0 2px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Siège(s)</p>
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">%s</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
 
                    <!-- Total + numéro de réservation -->
                    <tr>
                      <td style="padding: 0 40px 28px;">
                        <table width="100%%" cellpadding="0" cellspacing="0" style="
                          background: #f9fafb;
                          border: 1px solid #e5e7eb;
                          border-radius: 8px;
                        ">
                          <tr>
                            <td style="padding: 14px 18px; border-bottom: 1px solid #e5e7eb;">
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td><p style="margin:0; font-size:13px; color:#6b7280;">Total payé</p></td>
                                  <td align="right"><p style="margin:0; font-size:16px; font-weight:700; color:#111827;">%s&nbsp;TND</p></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 18px;">
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td><p style="margin:0; font-size:12px; color:#9ca3af;">Numéro de réservation</p></td>
                                  <td align="right"><p style="margin:0; font-size:12px; font-weight:600; color:#374151; font-family: monospace; letter-spacing: 0.5px;">%s</p></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
 
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px; border-top: 1px solid #f3f4f6;">
                        <p style="margin: 0; font-size: 12px; color: #d1d5db; line-height: 1.5;">
                          © 2026 CinéBook — Présentez cette confirmation à l'entrée. Ne pas répondre à cet email.
                        </p>
                      </td>
                    </tr>
 
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
        """.formatted(clientName, posterBlock, movieTitle, sessionDate, sessionTime,
                roomName, seats, totalPrice, numeroReservation);
    }
}

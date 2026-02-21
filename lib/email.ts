/**
 * Email service for CareerCompassi
 * Uses Resend for sending transactional emails
 */

import { Resend } from 'resend';
import { createLogger } from '@/lib/logger';

const log = createLogger('Email');

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Use onboarding@resend.dev for testing (always works with any Resend API key)
// Change to your verified domain email when you verify careercompassi.fi in Resend
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send password reset email to teacher
 *
 * @param to - Teacher's email address
 * @param resetToken - Raw reset token (NOT the hash)
 * @param teacherName - Teacher's name for personalization
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  teacherName: string
): Promise<void> {
  if (!resend) {
    log.warn('Resend not configured, skipping email send (dev mode)');
    log.info(`[DEV] Password reset link: ${SITE_URL}/teacher/reset-password?token=${resetToken}`);
    return;
  }

  const resetUrl = `${SITE_URL}/teacher/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Salasanan palautus - CareerCompassi',
      html: `
        <!DOCTYPE html>
        <html lang="fi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            h2 {
              color: #2c3e50;
              margin-top: 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 500;
            }
            .footer {
              margin-top: 30px;
              font-size: 0.9em;
              color: #666;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hei ${teacherName},</h2>

            <p>Pyysit salasanan palautusta CareerCompassi-opettajatilillesi.</p>

            <p>Palauta salasanasi klikkaamalla alla olevaa painiketta:</p>

            <a href="${resetUrl}" class="button">Palauta salasana</a>

            <p>Tai kopioi tämä linkki selaimeesi:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">
              ${resetUrl}
            </p>

            <div class="warning">
              <strong>Huom!</strong> Linkki on voimassa 1 tunnin.
            </div>

            <div class="footer">
              <p>Jos et pyytänyt salasanan palautusta, voit jättää tämän viestin huomiotta. Salasanasi pysyy turvassa.</p>

              <p>
                Ystävällisin terveisin,<br>
                <strong>CareerCompassi-tiimi</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hei ${teacherName},

Pyysit salasanan palautusta CareerCompassi-opettajatilillesi.

Palauta salasanasi klikkaamalla alla olevaa linkkiä:
${resetUrl}

Linkki on voimassa 1 tunnin.

Jos et pyytänyt salasanan palautusta, voit jättää tämän viestin huomiotta.

Ystävällisin terveisin,
CareerCompassi-tiimi
      `.trim()
    });

    log.info(`Password reset email sent to ${to}`);
  } catch (error) {
    log.error('Failed to send password reset email:', error);
    throw new Error('Sähköpostin lähetys epäonnistui');
  }
}

/**
 * Send password change confirmation email to teacher
 *
 * @param to - Teacher's email address
 * @param teacherName - Teacher's name for personalization
 */
export async function sendPasswordChangedEmail(
  to: string,
  teacherName: string
): Promise<void> {
  if (!resend) {
    log.warn('Resend not configured, skipping email send (dev mode)');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Salasanasi on vaihdettu - CareerCompassi',
      html: `
        <!DOCTYPE html>
        <html lang="fi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            h2 {
              color: #2c3e50;
              margin-top: 0;
            }
            .success {
              background-color: #d4edda;
              border-left: 4px solid #28a745;
              padding: 12px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 0.9em;
              color: #666;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hei ${teacherName},</h2>

            <div class="success">
              <strong>✓ Salasanasi on vaihdettu onnistuneesti!</strong>
            </div>

            <p>CareerCompassi-opettajatilin salasanasi on juuri vaihdettu.</p>

            <p>Jos et tehnyt tätä muutosta itse, ota välittömästi yhteyttä tukeen.</p>

            <div class="footer">
              <p>
                Ystävällisin terveisin,<br>
                <strong>CareerCompassi-tiimi</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hei ${teacherName},

Salasanasi on vaihdettu onnistuneesti!

CareerCompassi-opettajatilin salasanasi on juuri vaihdettu.

Jos et tehnyt tätä muutosta itse, ota välittömästi yhteyttä tukeen.

Ystävällisin terveisin,
CareerCompassi-tiimi
      `.trim()
    });

    log.info(`Password changed confirmation email sent to ${to}`);
  } catch (error) {
    log.error('Failed to send password changed email:', error);
    // Don't throw - this is just a confirmation email
  }
}

/**
 * Send welcome email with first-time setup instructions
 *
 * @param to - Teacher's email address
 * @param teacherName - Teacher's name for personalization
 * @param accessCode - Access code for first login
 */
export async function sendWelcomeEmail(
  to: string,
  teacherName: string,
  accessCode: string
): Promise<void> {
  if (!resend) {
    log.warn('Resend not configured, skipping email send (dev mode)');
    log.info(`[DEV] Welcome email - Access code: ${accessCode}`);
    return;
  }

  const activationUrl = `${SITE_URL}/teacher/first-login`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Tervetuloa CareerCompassi-palveluun!',
      html: `
        <!DOCTYPE html>
        <html lang="fi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            h2 {
              color: #2c3e50;
              margin-top: 0;
            }
            .access-code {
              background-color: #3b82f6;
              color: white;
              font-size: 24px;
              font-weight: bold;
              padding: 15px;
              text-align: center;
              border-radius: 6px;
              letter-spacing: 2px;
              margin: 20px 0;
              font-family: monospace;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 500;
            }
            .steps {
              background-color: white;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 0.9em;
              color: #666;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Tervetuloa, ${teacherName}!</h2>

            <p>CareerCompassi-opettajatilisi on luotu. Aloita asettamalla oma salasanasi.</p>

            <div class="steps">
              <strong>Aktivoi tilisi:</strong>
              <ol>
                <li>Siirry osoitteeseen: <a href="${activationUrl}">${activationUrl}</a></li>
                <li>Syötä pääsykoodisi</li>
                <li>Aseta oma salasanasi (vähintään 10 merkkiä)</li>
              </ol>
            </div>

            <p><strong>Pääsykoodisi:</strong></p>
            <div class="access-code">${accessCode}</div>

            <p><strong>Huom!</strong> Pääsykoodi toimii vain kerran. Sen jälkeen kirjaudut sisään sähköpostilla ja salasanalla.</p>

            <div class="footer">
              <p>
                Ystävällisin terveisin,<br>
                <strong>CareerCompassi-tiimi</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Tervetuloa, ${teacherName}!

CareerCompassi-opettajatilisi on luotu. Aloita asettamalla oma salasanasi.

AKTIVOI TILISI:

1. Siirry osoitteeseen: ${activationUrl}
2. Syötä pääsykoodisi: ${accessCode}
3. Aseta oma salasanasi (vähintään 10 merkkiä)

Huom! Pääsykoodi toimii vain kerran. Sen jälkeen kirjaudut sisään sähköpostilla ja salasanalla.

Ystävällisin terveisin,
CareerCompassi-tiimi
      `.trim()
    });

    log.info(`Welcome email sent to ${to}`);
  } catch (error) {
    log.error('Failed to send welcome email:', error);
    // Don't throw - teacher can still activate with access code manually
  }
}

import { BACKEND_URL, mailer } from '../lib.js';

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BACKEND_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify your email',
    text: `Verify your email: ${link}`,
    html: `
      <p>Click the link below to verify your account:</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });
}
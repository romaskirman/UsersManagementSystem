import { resend } from '../lib.js';

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: 'Verify your email',
    text: `Verify your email: ${link}`,
    html: `
      <p>Click the link below to verify your account:</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });
}
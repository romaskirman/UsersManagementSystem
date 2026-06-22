import { Resend } from 'resend';

type SenderConfig = {
  to: string;
  apiKey: string;
};

function getSenderConfigs(): SenderConfig[] {
  const configs: SenderConfig[] = [];

  for (let i = 1; i <= 10; i++) {
    const to = process.env[`RESEND_TO_${i}`];
    const apiKey = process.env[`RESEND_API_KEY_${i}`];

    if (to && apiKey) {
      configs.push({
        to: to.trim().toLowerCase(),
        apiKey: apiKey.trim(),
      });
    }
  }

  return configs;
}

function getSenderConfigForRecipient(email: string): SenderConfig {
  const normalizedEmail = email.trim().toLowerCase();
  const configs = getSenderConfigs();

  const exactMatch = configs.find((config) => config.to === normalizedEmail);
  if (exactMatch) return exactMatch;

  throw new Error(`No Resend API key configured for recipient: ${normalizedEmail}`);
}

export async function sendVerificationEmail(email: string, token: string) {
  const sender = getSenderConfigForRecipient(email);
  const resend = new Resend(sender.apiKey);

  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    to: email,
    subject: 'Verify your email',
    text: `Verify your email: ${link}`,
    html: `
      <p>Click the link below to verify your account:</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });
}
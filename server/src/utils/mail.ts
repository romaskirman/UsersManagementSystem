import { Resend } from 'resend';

type SenderConfig = {
  from: string;
  apiKey: string;
};

function getSenderConfigs(): SenderConfig[] {
  const configs: SenderConfig[] = [];

  for (let i = 1; i <= 10; i++) {
    const from = process.env[`RESEND_FROM_${i}`];
    const apiKey = process.env[`RESEND_API_KEY_${i}`];

    if (from && apiKey) {
      configs.push({
        from: from.trim().toLowerCase(),
        apiKey: apiKey.trim(),
      });
    }
  }

  return configs;
}

function getSenderConfigForRecipient(email: string): SenderConfig {
  const normalizedEmail = email.trim().toLowerCase();
  const configs = getSenderConfigs();

  const exactMatch = configs.find((config) => config.from === normalizedEmail);
  if (exactMatch) return exactMatch;

  throw new Error(`No Resend sender config found for recipient: ${normalizedEmail}`);
}

export async function sendVerificationEmail(email: string, token: string) {
  const sender = getSenderConfigForRecipient(email);
  const resend = new Resend(sender.apiKey);

  const link = `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const result = await resend.emails.send({
    from: sender.from,
    to: email,
    subject: 'Verify your email',
    text: `Verify your email: ${link}`,
    html: `
      <p>Click the link below to verify your account:</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });

  console.log('verification email sent', {
    to: email,
    from: sender.from,
    result,
  });
}
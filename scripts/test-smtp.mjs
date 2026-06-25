import nextEnv from "@next/env";
import nodemailer from "nodemailer";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const recipient = process.argv[2];
if (!recipient) {
  console.error("Usage: npm run smtp:test -- recipient@example.com");
  process.exit(1);
}

const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const port = Number(process.env.SMTP_PORT || "465");
const secure =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  requireTLS: !secure,
  tls: { minVersion: "TLSv1.2" },
});

try {
  await transporter.verify();

  const info = await transporter.sendMail({
    from: {
      name: process.env.MAIL_FROM_NAME || "Art Vision",
      address:
        process.env.MAIL_FROM_EMAIL || "contact@art-visions.fr",
    },
    to: recipient,
    subject: "Test SMTP Art Vision",
    text: "La configuration SMTP Gandi d’Art Vision fonctionne correctement.",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#08051f;color:#f8f7fc">
        <h1 style="color:#ff6a00">Test SMTP réussi</h1>
        <p>La configuration SMTP Gandi d’Art Vision fonctionne correctement.</p>
      </div>
    `,
  });

  console.log(`SMTP test sent successfully. Message ID: ${info.messageId}`);
} catch (error) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "UNKNOWN";
  console.error(`SMTP test failed (${code}).`);
  process.exit(1);
} finally {
  transporter.close();
}

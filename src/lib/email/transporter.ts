import "server-only";
import nodemailer from "nodemailer";

export function smtpConfigured() { return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS); }
export function createTransporter() {
  if (!smtpConfigured()) throw new Error("SMTP_NOT_CONFIGURED");
  const port = Number(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.gandi.net", port, secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
    requireTLS: !secure,
    tls: { minVersion: "TLSv1.2" },
  });
}
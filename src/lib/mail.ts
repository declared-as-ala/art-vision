import "server-only";
import { createTransporter } from "@/lib/email/transporter";

export async function sendMail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  try {
    const info = await createTransporter().sendMail({
      from: {
        name: process.env.MAIL_FROM_NAME || "Art Vision",
        address:
          process.env.MAIL_FROM_EMAIL || "contact@art-visions.fr",
      },
      to,
      subject,
      html,
      text: text || subject,
      replyTo,
    });

    return { success: true, messageId: info.messageId };
  } catch {
    return {
      success: false,
      error: "Impossible d’envoyer l’e-mail pour le moment.",
    };
  }
}

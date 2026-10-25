import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.email("Email invalide").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Décrivez votre projet en quelques mots").max(4000),
  // Honeypot: real users leave this empty.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

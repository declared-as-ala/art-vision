import React from "react";
import prisma from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import { Sparkles, MapPin, Mail, Phone, Clock, Globe } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  let settings: any = null;

  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });
  } catch (error) {
    console.error("Error fetching site settings for contact page:", error);
  }

  const email = settings?.email || "contact@art-visions.fr";
  const phone = settings?.phone || "+33 2 43 00 00 00";
  const franceAddress = settings?.franceAddress || "5 Rue de Constantine, 72000 Le Mans";
  const tunisiaAddress = settings?.tunisiaAddress || "Bur 5, étage 5 Imm souk lybia, 5000 Monastir";

  return (
    <div className="min-h-screen bg-brand-navy pt-32 pb-20 px-4">
      {/* Glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Nous Contacter</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Contactez <span className="text-brand-magenta">Art Vision</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Une question sur nos services ? Un projet à lancer ? Remplissez le formulaire ou contactez directement nos bureaux en France ou en Tunisie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (Left 5 Columns) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="glassmorphism rounded-2xl p-6 md:p-8 space-y-6 border border-brand-purple/20">
              <h2 className="font-sora font-bold text-lg text-white">
                Coordonnées de l'agence
              </h2>
              
              <ul className="space-y-6 text-xs md:text-sm text-white/70">
                <li className="flex items-start space-x-4">
                  <MapPin size={24} className="text-brand-magenta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Siège Social (France) :</span>
                    <span>{franceAddress}</span>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <MapPin size={24} className="text-brand-purple shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Bureau (Tunisie) :</span>
                    <span>{tunisiaAddress}</span>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <Mail size={20} className="text-brand-orange shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Adresse E-mail :</span>
                    <a href={`mailto:${email}`} className="hover:text-brand-orange transition">{email}</a>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <Phone size={20} className="text-brand-magenta shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Téléphone direct :</span>
                    <a href={`tel:${phone}`} className="hover:text-brand-magenta transition">{phone}</a>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <Clock size={20} className="text-brand-purple shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Heures d'ouverture :</span>
                    <span>Lundi - Vendredi | 9h00 - 18h00</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Maps Mockup Frame */}
            <div className="glassmorphism rounded-2xl p-2 border border-brand-purple/15 overflow-hidden">
              <iframe
                title="Google Maps Art Vision Le Mans"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2667.6534571932915!2d0.19830501177695328!3d48.00114097123616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e28f32145b23d9%3A0xe543df5e900c3cd!2s5%20Rue%20de%20Constantine%2C%2072000%20Le%20Mans!5e0!3m2!1sfr!2sfr!4v1718182283921!5m2!1sfr!2sfr"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "0.75rem" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form Wrapper (Right 7 Columns) */}
          <div className="lg:col-span-7 glassmorphism rounded-2xl p-6 md:p-8 border border-brand-purple/20">
            <h2 className="font-sora font-bold text-lg text-white mb-6">
              Envoyer un message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

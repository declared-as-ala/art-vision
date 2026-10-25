export type Locale = "fr" | "ar";

export const LOCALES: Locale[] = ["fr", "ar"];

export const HTML_LANG: Record<Locale, string> = { fr: "fr-TN", ar: "ar-TN" };

/** URL prefix per locale (French is the default and lives at the root). */
export const prefix = (l: Locale) => (l === "ar" ? "/ar" : "");

export const DICT = {
  fr: {
    nav: { services: "Services", portfolio: "Réalisations", tools: "Outils gratuits", blog: "Blog", contact: "Contact" },
    quote: "Demander un devis",
    quoteFree: "Demander un devis gratuit",
    home: "Accueil",
    allServices: "Tous les services",
    learnMore: "En savoir plus",
    footerTag: "Agence de création graphique et digitale en Tunisie. Logo, identité visuelle, supports imprimés et sites web.",
    footerServices: "Services",
    footerAgency: "Agence",
    rights: "Tous droits réservés.",
    switchTo: "العربية",
    switchLabel: "Passer en arabe",
    form: {
      name: "Nom", email: "Email", phone: "Téléphone (optionnel)", company: "Entreprise (optionnel)",
      service: "Service souhaité", serviceUndefined: "À définir ensemble", message: "Votre projet",
      send: "Envoyer ma demande", sending: "Envoi…", thanks: "Merci, votre demande est envoyée.", thanksSub: "Nous revenons vers vous avec une proposition.",
      errName: "Nom requis", errEmail: "Email invalide", errMessage: "Décrivez votre projet en quelques mots", errGeneric: "Une erreur est survenue.",
    },
  },
  ar: {
    nav: { services: "الخدمات", portfolio: "أعمالنا", tools: "أدوات مجانية", blog: "المدونة", contact: "اتصل بنا" },
    quote: "اطلب عرض سعر",
    quoteFree: "اطلب عرض سعر مجاني",
    home: "الرئيسية",
    allServices: "جميع الخدمات",
    learnMore: "اعرف المزيد",
    footerTag: "وكالة تصميم جرافيك ورقمنة في تونس. شعارات وهوية بصرية ومطبوعات ومواقع إلكترونية.",
    footerServices: "الخدمات",
    footerAgency: "الوكالة",
    rights: "جميع الحقوق محفوظة.",
    switchTo: "Français",
    switchLabel: "Passer en français",
    form: {
      name: "الاسم", email: "البريد الإلكتروني", phone: "الهاتف (اختياري)", company: "الشركة (اختياري)",
      service: "الخدمة المطلوبة", serviceUndefined: "نحدّدها معًا", message: "مشروعكم",
      send: "إرسال الطلب", sending: "جارٍ الإرسال…", thanks: "شكرًا، تم إرسال طلبكم.", thanksSub: "سنعود إليكم بعرض مناسب.",
      errName: "الاسم مطلوب", errEmail: "بريد إلكتروني غير صالح", errMessage: "صِفوا مشروعكم في بضع كلمات", errGeneric: "حدث خطأ ما.",
    },
  },
} as const;

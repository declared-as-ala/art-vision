"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const whatsappNumber = "33600000000"; // Replace with client's phone in admin settings in production
  const message = encodeURIComponent(
    "Bonjour Art Vision, j'ai visité votre site web et j'aimerais échanger sur un projet !"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  if (!visible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-tracking="whatsapp_click"
      aria-label="Contactez-nous sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping group-hover:hidden"></span>
      
      {/* WhatsApp SVG Icon */}
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.487 4.987 1.488 5.349-.001 9.704-4.321 9.707-9.63.002-2.573-1.002-4.992-2.827-6.819C16.69 2.365 14.27 1.361 11.7 1.361c-5.352 0-9.709 4.322-9.712 9.631a9.52 9.52 0 001.442 4.96l-.97 3.543 3.635-.947zM17.432 14.18c-.31-.156-1.84-.901-2.128-1.004-.288-.103-.497-.156-.707.156-.21.312-.813 1.004-.997 1.21-.183.207-.367.234-.678.078-1.564-.78-2.617-1.378-3.666-3.184-.282-.48.282-.444.808-1.492.08-.168.04-.312-.02-.468-.06-.156-.497-1.21-.68-1.656-.179-.434-.374-.374-.515-.381l-.439-.009c-.152 0-.4-.056-.61.18-.21.236-.8.78-.8 1.9s.81 2.202.924 2.355c.114.153 1.597 2.44 3.867 3.42 2.27.979 2.27.653 2.685.615.414-.037 1.84-.753 2.1-.1.482c.26-.26.26-.498.13-.678-.13-.18-.497-.312-.806-.468z" />
      </svg>
      <span className="absolute right-14 bg-brand-navy border border-brand-purple/40 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
        Discutons sur WhatsApp !
      </span>
    </a>
  );
}

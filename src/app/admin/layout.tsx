"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  FileText,
  MessageSquare,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Search,
  Layers,
  ChevronRight,
  Wand2,
  Mail,
  Printer,
  BarChart3,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render only children
  if (pathname === "/admin/login") {
    return <div className="min-h-screen hero-gradient">{children}</div>;
  }

  const menuItems = [
    { name: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
    { name: "Analytique", href: "/admin/analytics", icon: BarChart3 },
    { name: "Devis / Demandes", href: "/admin/quotes", icon: ClipboardList },
    { name: "Emails & Notifications", href: "/admin/emails", icon: Mail },
    { name: "Outils Gratuits", href: "/admin/tools", icon: Wand2 },
    { name: "Impression & Tarifs", href: "/admin/print", icon: Printer },
    { name: "Pages Site", href: "/admin/pages", icon: Layers },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Portfolio", href: "/admin/portfolio", icon: ExternalLink },
    { name: "Blog / Articles", href: "/admin/blog", icon: FileText },
    { name: "Témoignages", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Gestion SEO", href: "/admin/seo", icon: Search },
    { name: "Paramètres Site", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
        {/* Logo Block */}
        <div className="px-2 pb-4 border-b border-brand-purple/20">
          <div className="flex items-center gap-3 mb-1">
            <img src="/logo.svg" alt="Art Vision" className="h-8 w-auto object-contain" />
          </div>
          <span className="text-[10px] text-brand-purple uppercase tracking-[0.18em] font-semibold block mt-2">
            Espace Administration
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-brand-magenta to-brand-purple text-white shadow-lg shadow-brand-magenta/20"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} className={active ? "text-white" : "text-white/40 group-hover:text-white/80"} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight size={12} className="opacity-70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="space-y-2 pt-4 border-t border-brand-purple/15 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-[10px] font-semibold text-white/40 hover:text-brand-magenta transition px-4 py-2 rounded-lg hover:bg-white/5"
        >
          <ExternalLink size={12} />
          <span>Voir le site public</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer"
        >
          <LogOut size={15} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex text-white font-sans" style={{
      background: "linear-gradient(135deg, #09031c 0%, #150933 35%, #2D2966 70%, #050314 100%)"
    }}>
      {/* Ambient background glows — matches homepage hero feel */}
      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-brand-magenta/8 blur-[140px]" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-brand-magenta/5 blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 relative z-10 border-r border-white/5 p-5"
        style={{ background: "rgba(8, 4, 26, 0.6)", backdropFilter: "blur(20px)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 z-10 p-5 border-r border-white/5"
            style={{ background: "rgba(8, 4, 26, 0.97)", backdropFilter: "blur(20px)" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Right side: header + content */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 shrink-0 border-b border-white/5"
          style={{ background: "rgba(8, 4, 26, 0.55)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white transition"
            >
              <Menu size={22} />
            </button>

            {/* Breadcrumb / page title area */}
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Administration</p>
              <h1 className="font-sora font-bold text-sm text-white leading-tight">
                Tableau de Bord
              </h1>
            </div>
          </div>

          {/* Right side of header */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-white/40 hover:text-brand-magenta transition px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-magenta/30"
            >
              <ExternalLink size={11} />
              Site public
            </Link>
            <span className="text-[10px] bg-brand-magenta/15 text-brand-magenta border border-brand-magenta/25 px-3 py-1.5 rounded-full font-bold tracking-wide">
              Admin
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

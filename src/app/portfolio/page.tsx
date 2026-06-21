import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Sparkles, ArrowRight } from "lucide-react";
import FilterablePortfolio from "./FilterablePortfolio";

export const revalidate = 60;

export default async function PortfolioPage() {
  let categories: any[] = [];
  let projects: any[] = [];

  try {
    categories = await prisma.portfolioCategory.findMany({
      orderBy: { name: "asc" }
    });
    projects = await prisma.portfolioProject.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Nos Créations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Découvrez nos <span className="text-brand-magenta">réalisations</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            De la création de logo à la production 3D photoréaliste et aux sites vitrines Next.js, explorez nos projets les plus marquants.
          </p>
        </div>

        {/* Client side filter and grid */}
        <FilterablePortfolio initialProjects={projects} categories={categories} />
      </div>
    </div>
  );
}

// Render at request time (data from the DB); avoids build-time DB access.
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/cms";
import {
  ChevronRight,
  ArrowLeft,
  Building,
  Target,
  Sparkles,
  Info,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { draftMode } from "next/headers";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const project = await prisma.portfolioProject.findUnique({ where: { slug } });
  if (!project || (project.status !== "PUBLISHED" && !isEnabled)) return {};
  const canonical = `https://art-visions.fr/portfolio/${slug}`;
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.objective,
    alternates: { canonical },
    robots: { index: !isEnabled, follow: !isEnabled },
    openGraph: { title: project.seoTitle || project.title, description: project.seoDescription || project.objective, url: canonical, type: "website" },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  let project: any = null;

  try {
    project = await prisma.portfolioProject.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
  }

  if (!project || (project.status !== "PUBLISHED" && !isPreview)) {
    notFound();
  }

  const imagesList = project.images.split(";").filter((img: string) => img.trim() !== "");

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      {/* Glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/15 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Back Link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-white/50 hover:text-brand-magenta transition uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Retour au portfolio</span>
        </Link>

        {/* Header Block */}
        <div className="space-y-4 text-left">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-magenta text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category.name}
          </span>
          <h1 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-xs text-white/60 font-medium">
            <span className="flex items-center space-x-1">
              <Building size={14} className="text-brand-orange" />
              <span>Client : <strong>{project.client}</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Info size={14} className="text-brand-magenta" />
              <span>Secteur : <strong>{project.industry}</strong></span>
            </span>
          </div>
        </div>

        {/* Case Study Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Main Content (Left 2 columns) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Project Overview Images */}
            <div className="grid grid-cols-1 gap-6">
              {imagesList.map((img: string, idx: number) => (
                <div key={idx} className="aspect-[16/10] bg-brand-purple/20 rounded-2xl overflow-hidden border border-brand-purple/15">
                  <img
                    src={img}
                    alt={`${project.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Objective, Challenge, Solution */}
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <h3 className="font-sora font-bold text-lg text-white flex items-center space-x-2">
                  <Target size={16} className="text-brand-magenta" />
                  <span>Objectif</span>
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{project.objective}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-sora font-bold text-lg text-white flex items-center space-x-2">
                  <Info size={16} className="text-brand-orange" />
                  <span>Le Défi</span>
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{project.challenge}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-sora font-bold text-lg text-white flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Notre Solution</span>
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{project.solution}</p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right 1 column) */}
          <div className="space-y-6">
            
            {/* Results Panel */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-orange/20 space-y-3 text-left">
              <h3 className="font-sora font-bold text-sm text-white uppercase tracking-wider text-brand-orange">Résultats obtenus</h3>
              <p className="text-xs text-white/85 leading-relaxed">{project.result}</p>
            </div>

            {/* Testimonial Panel */}
            {project.testimonial && (
              <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 space-y-4 text-left">
                <MessageSquare size={20} className="text-brand-magenta" />
                <p className="text-xs text-white/80 italic leading-relaxed">
                  « {project.testimonial} »
                </p>
                <div className="border-t border-brand-purple/10 pt-3">
                  <strong className="text-xs text-white block">{project.testimonialAuthor}</strong>
                  <span className="text-[10px] text-white/50 block">{project.testimonialRole}</span>
                </div>
              </div>
            )}

            {/* Action CTA */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 text-center space-y-4">
              <h4 className="font-sora font-bold text-sm text-white">Un projet similaire ?</h4>
              <p className="text-[11px] text-white/60">Échangeons sur vos besoins et créons une communication à la hauteur de votre image.</p>
              <Link
                href={`/devis-sur-mesure?prefill=branding&product=${encodeURIComponent(project.title)}`}
                className="block text-center bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-xl font-bold text-xs transition"
              >
                Lancer mon projet
              </Link>
            </div>
          </div>
        </div>

        {/* Custom HTML block (admin-managed, sanitized) */}
        {project.customHtml && (
          <div
            className="cms-rich-content text-sm text-white/80 leading-relaxed border-t border-brand-purple/15 pt-10 mt-10"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.customHtml) }}
          />
        )}
      </div>
    </div>
  );
}

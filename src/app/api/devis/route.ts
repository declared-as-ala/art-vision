import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      service,
      details,
      budget,
      deadline,
      fileData, // Base64 string if uploaded
      fileName,
      name,
      email,
      phone,
      company,
      consent,
    } = body;

    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { success: false, error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    // Save to DB
    const quote = await prisma.quoteRequest.create({
      data: {
        service,
        details: details || "Aucun détail fourni.",
        budget,
        deadline,
        fileUrl: fileData ? `uploaded_${Date.now()}_${fileName}` : null,
        name,
        email,
        phone,
        company: company || null,
        consent: !!consent,
        status: "NEW",
      },
    });

    // Send admin notification
    const adminHtml = `
      <h2>Nouvelle demande de devis sur Art Vision</h2>
      <p><strong>Service :</strong> ${service}</p>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Téléphone :</strong> ${phone}</p>
      <p><strong>Entreprise :</strong> ${company || "Non spécifié"}</p>
      <p><strong>Budget estimé :</strong> ${budget}</p>
      <p><strong>Délai souhaité :</strong> ${deadline}</p>
      <p><strong>Détails du projet :</strong></p>
      <blockquote style="background:#f4f4f4;padding:15px;border-left:5px solid #6C2BD9;">
        ${details.replace(/\n/g, "<br>")}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/quotes">Voir dans le dashboard</a></p>
    `;
    await sendMail({
      to: "contact@art-visions.fr",
      subject: `[Nouveau Devis] ${service} - ${name}`,
      html: adminHtml,
    });

    // Send client confirmation
    const clientHtml = `
      <div style="font-family:sans-serif;color:#171625;max-width:600px;margin:0 auto;padding:20px;border:1px solid #EDEAF5;border-radius:10px;">
        <h2 style="color:#6C2BD9;">Bonjour ${name},</h2>
        <p>Nous avons bien reçu votre demande de devis pour votre projet de <strong>${service}</strong>.</p>
        <p>Notre équipe de SAS ART VISION étudie vos besoins et vous recontactera sous 24 heures ouvrées pour vous proposer une offre personnalisée.</p>
        <hr style="border:none;border-top:1px solid #EDEAF5;margin:20px 0;">
        <p style="font-size:12px;color:#999;">Cet e-mail est une confirmation automatique. Merci de ne pas y répondre directement.</p>
        <p style="font-size:12px;font-weight:bold;color:#6C2BD9;">Art Vision — L’art au service de votre image.</p>
      </div>
    `;
    await sendMail({
      to: email,
      subject: `Votre demande de devis Art Vision`,
      html: clientHtml,
    });

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error: any) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}

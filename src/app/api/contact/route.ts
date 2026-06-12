import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json({ success: true, messageId: contactMsg.id });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la soumission." },
      { status: 500 }
    );
  }
}

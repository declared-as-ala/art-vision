import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Veuillez entrer votre email et votre mot de passe." },
        { status: 400 }
      );
    }

    // Find user in SQLite
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Verify Password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Issue token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur interne du serveur.";
    const publicError = errorMessage.includes("JWT_SECRET")
      ? "JWT_SECRET non configuré en production. Vérifiez les variables d'environnement."
      : "Erreur interne du serveur.";

    return NextResponse.json(
      { success: false, error: publicError },
      { status: 500 }
    );
  }
}

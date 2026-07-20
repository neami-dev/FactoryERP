"use server";
import { sendEmail } from "../mailer";
import { prisma } from "../prisma";
import { handleError } from "../utils";
import { getUserEmail, updateUser } from "./user.actions";
import { v4 as uuid } from "uuid";

export async function sendForgetPassword(email: string) {
  try {
    const user = await getUserEmail(email);

    if (!user) return { success: false };

    const token = uuid();
    const expires = new Date(Date.now() + 1000 * 60 * 60); //1H

    await prisma.passowrd_reset_token.create({
      data: { token, userId: user.id, expires },
    });
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      "Réinitialisation de votre mot de passe",
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
      <p>Bonjour ${user.person?.firstname || ""} ${" "} ${
        user.person?.lastname || ""
      },</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Veuillez cliquer sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
        Réinitialiser mon mot de passe
      </a>
      <p style="margin-top: 20px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
      <p>Ce lien expirera dans 1 heure.</p>
      <br/>
      <p style="font-size: 12px; color: #999;">Cordialement,<br/>L’équipe ABX Group</p>
    </div>
  `
    );
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

export async function resetPassowrd({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  try {
    const resetToken = await prisma.passowrd_reset_token.findUnique({
      where: {
        token,
      },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false };
    }
    await updateUser({ id: resetToken?.userId, user: { password }, path: "/" });
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

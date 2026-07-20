"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { sendForgetPassword } from "@/lib/actions/forgetPassowrd.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const res = await sendForgetPassword(data.email);
      if (res?.success) {
        toast.success("Email de réinitialisation envoyé avec succès.");
        setIsSubmitted(true);
      } else {
        toast.error(
          "Adresse e-mail introuvable. Veuillez vérifier et réessayer."
        );
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi du formulaire.");
      console.log(error);
      
    }
  };
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">E-mail envoyé</CardTitle>
            <CardDescription>
              Si le nom d&apos;utilisateur existe, vous recevrez des instructions de
              réinitialisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
              <p>
                Nous avons envoyé un lien de réinitialisation à{" "}
                <strong>{getValues("email")}</strong> si ce compte existe dans
                notre système.
              </p>
              <p className="mt-2">
                Vérifiez votre boîte e-mail et suivez les instructions pour
                réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full cursor-pointer"
              >
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Link>
              </Button>

              <Button
                onClick={() => {
                  setIsSubmitted(false);
                }}
                variant="ghost"
                className="w-full cursor-pointer"
              >
                Essayer avec une autre adresse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Mot de passe oublié
            </CardTitle>
            <CardDescription>
              Saisissez votre adresse e-mail pour recevoir un lien de
              réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="votre@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                disabled={!isDirty || isSubmitting}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Envoyer le lien de réinitialisation
              </Button>

              <div className="text-center">
                <Button asChild variant="ghost" className="text-sm">
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

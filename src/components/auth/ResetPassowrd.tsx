"use client";
import { useState } from "react";
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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassowrd } from "@/lib/actions/forgetPassowrd.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z.object({
  passowrd: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      "Le mot de passe doit contenir une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
    ),
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassowrd({ token }: { token: string }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    const res = await resetPassowrd({
      password: data.passowrd,
      token,
    });
    if (res?.success) {
      toast.success("Le mot de passe a été réinitialisé avec succès.");
      router.replace("/login");
    } else {
      toast.error("Le lien est invalide ou expiré. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Réinitialiser le mot de passe
          </CardTitle>
          <CardDescription>
            Saisissez votre mot de passe actuel et choisissez un nouveau mot de
            passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="Password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("passowrd")}
                  placeholder="Saisissez votre nouveau mot de passe"
                  className={errors.passowrd ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.passowrd && (
                <p className="text-destructive text-sm">
                  {errors.passowrd.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Réinitialiser le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

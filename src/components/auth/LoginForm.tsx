"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginFormSchema } from "@/lib/validator";
import { useState } from "react";
import Image from "next/image";
import { Factory, Fish, Waves } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [showPsw, setShowpsw] = useState(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "superadmin",
      password: "Test@#123",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      form.setError("username", {
        message: "Nom d'utilisateur ou mot de passe invalide",
      });
      form.setError("password", {
        message: "Nom d'utilisateur ou mot de passe invalide",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 text-blue-100 opacity-20 animate-pulse">
            <Waves size={80} />
          </div>
          <div
            className="absolute bottom-1/3 left-1/6 text-cyan-100 opacity-15 animate-bounce"
            style={{ animationDelay: "2s" }}
          >
            <Factory size={60} />
          </div>
        </div>

        <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Fish className="h-8 w-8 text-white animate-pulse" />
            </div>
            <CardTitle
              className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Usine de Poisson
            </CardTitle>
            <CardDescription
              className="text-gray-600 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Système de Gestion et Facturation
            </CardDescription>
          </CardHeader>

          <CardContent
            className="animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-12 my-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="md:text-base">
                          Nom d utilisateur
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="md:py-5 placeholder:text-sm"
                            placeholder="Entrez votre nom d'utilisateur"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        {showPsw ? (
                          <Image
                            onClick={() => setShowpsw(!showPsw)}
                            src="/icons/eye-hide.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="absolute cursor-pointer top-8 md:top-10 right-4"
                          />
                        ) : (
                          <Image
                            onClick={() => setShowpsw(!showPsw)}
                            src="/icons/eye-show.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="absolute cursor-pointer top-8 md:top-10 right-4"
                          />
                        )}
                        <div className="flex items-center justify-between">
                          <FormLabel className="md:text-base">
                            Mot de passe
                          </FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs md:text-sm text-[#3354f4] hover:underline"
                          >
                            Mot de passe oublié ?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            className="md:py-5"
                            type={`${showPsw ? "text" : "password"}`}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter>
                  <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full my-2 md:text-base bg-[#3354f4] cursor-pointer hover:bg-[#3354f4]/90"
                  >
                    {form.formState.isSubmitting
                      ? "Soumission..."
                      : "Se connecter"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 hidden md:block relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 text-white/10 ">
            <Fish size={120} />
          </div>
          <div
            className="absolute bottom-20 left-10 text-white/10 animate-pulse"
            style={{ animationDelay: "3s" }}
          >
            <Waves size={100} />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/5">
            <Factory size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

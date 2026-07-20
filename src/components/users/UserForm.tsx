"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Gender } from "@prisma/client";
import { IRole, IUser } from "@/interfaces";
import { userDefaultValues } from "@/constants";
import { userFormSchema } from "@/lib/validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";

import { createUser, updateUser } from "@/lib/actions/user.actions";
import { Checkbox } from "../ui/checkbox";

interface UserDetailFormProps {
  initialData?: IUser;
  userId?: number;
  type: "Create" | "Update";
  roles?: IRole[];
  onSubmit?: () => void;
  onCancel?: () => void;
}

const UserForm = ({
  initialData,
  roles,
  type,
  userId,
  onCancel,
}: UserDetailFormProps) => {
  const [showPsw, setShowpsw] = useState(false);
  const defaultValues =
    initialData && type === "Update"
      ? {
          firstname: initialData.person?.firstname,
          lastname: initialData.person?.lastname,
          username: initialData.username,
          password: "",
          email: initialData.email ?? "",
          phone_number: initialData.person?.phone_number,
          address: initialData.person?.adress ?? "",
          gender: initialData.person?.gender ?? Gender.MALE,
          date_of_birth: initialData.person?.date_of_birth
            ? new Date(initialData.person?.date_of_birth)
            : undefined,
          auth_allowed: initialData.auth_allowed,
          role_id: initialData.role_id,
        }
      : userDefaultValues;

  const createSchema = userFormSchema;
  const updateSchema = userFormSchema.partial();

  const schema = type === "Create" ? createSchema : updateSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    if (type === "Create") {
      const validatedData = createSchema.parse(values);
      const response = await createUser({
        user: validatedData,
        path: "/dashboard/users",
      });
    
      if (response.success === true) {
        form.reset();
        if (onCancel) onCancel();
      }
      if ((response.errors?.length ?? 0) > 0) {
        response.errors?.forEach((error) => {
          form.setError(error.field as keyof z.infer<typeof userFormSchema>, {
            type: "manual",
            message: error.msg,
          });
        });
        return;
      }
    }

    if (type === "Update" && userId) {
      const validatedData = updateSchema.parse(values);

      const response = await updateUser({
        user: validatedData,
        id: userId,
        path: "/dashboard/users",
      });
      if ((response.errors?.length ?? 0) > 0) {
        response.errors?.forEach((error) => {
          form.setError(error.field as keyof z.infer<typeof userFormSchema>, {
            type: "manual",
            message: error.msg,
          });
        });
        return;
      }
      if (response.success === true) {
        form.reset();
        if (onCancel) onCancel();
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Détails de l utilisateur</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d utilisateur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom d'utilisateur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
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
                        className="absolute cursor-pointer top-[30px]  right-4"
                      />
                    ) : (
                      <Image
                        onClick={() => setShowpsw(!showPsw)}
                        src="/icons/eye-show.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="absolute cursor-pointer top-[30px]   right-4"
                      />
                    )}
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type={`${showPsw ? "text" : "password"}`}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le numéro de téléphone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez l'adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile Image URL */}
            {/* <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image de profil (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez l'URL de l'image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value ? String(field.value) : undefined
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez le genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Homme</SelectItem>
                          <SelectItem value="FEMALE">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birthdate */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      {...field}
                      value={field?.value ? String(field.value) : undefined}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role, index) => {
                          return (
                            <SelectItem key={index} value={String(role.id)}>
                              {role.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="auth_allowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Utilisateur actif</FormLabel>
                      <FormDescription>
                        Indique si cet utilisateur peut se connecter.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="reset" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#3354f4] cursor-pointer hover:bg-[#3354f4]/90"
            >
              Enregistrer
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;

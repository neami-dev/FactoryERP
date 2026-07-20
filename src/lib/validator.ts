import { Box_type, InvoiceStatus, Wrapping_type } from "@prisma/client";
import * as z from "zod";

export const receptionFormSchema = z.object({
  supplier_id: z.coerce.number().min(1, "le fournisseur est requis"),
  plate_number: z
    .string()
    .min(4, "Le numéro de plaque doit comporter au moins 4 caractères"),
  origin: z.string().min(1, "L'origine est requise"),
  tare_weight: z
  .coerce.number({
    invalid_type_error: "Le tare de poids est requis",
  })
  .min(0, "Le tare de poids est requis"),
  fish_category_id: z.coerce
    .number()
    .min(1, "La catégorie de poisson est requise"),
  untraced_price_kg: z.number().optional(),
  crate_number: z.number().optional(),
  weight_taken_in_wrapping: z.number().optional(),
  price_kg: z.number().optional(),
  paid_price: z.number().optional(),
  isFinished: z.boolean().optional(),
  isTrace: z.boolean().optional(),
  is_wrapped: z.boolean().optional(),
  isFinished_add_trace: z.boolean().optional(),
  isValid: z.boolean().optional(),
  invoiceStatus: z.nativeEnum(InvoiceStatus).optional(),
});

export const validateWeigherId = z.coerce.number().min(1, "Peseur est requise");

export const validateReceptionId = z.coerce
  .number()
  .min(1, "Reception est requise");

export const validateWieghtTypeId = z.string().min(1, "le taille est requise");

export const receptionWFFormSchema = z.object({
  weight: z.string().min(1, "Le poids est requis"),

  crate: z.coerce.number().min(1, "La caisse doit contenir au moins 1"),
  weight_type_id: z.coerce.number().min(1, "Le type de poids est requis"),
  quality_id: z.number().min(1, { message: "Le qualite est requis" }),
  price_kg: z.coerce.number().optional(),
});
export const wrappingWFFormSchema = z.object({
  weight: z.string().min(1, "Le poids est requis"),

  crate: z.coerce.number().min(1, "La caisse doit contenir au moins 1"),
  weight_type_id: z.coerce.number().min(1, "Le type de poids est requis"),
  price_kg: z.coerce.number().optional(),
});
export const validateWrappingId = z.coerce
  .number()
  .min(1, "Emballage est requis");

export const wrappingWeightFishSchema = z.object({
  wrapping_weight_type_id: z.coerce.number().min(1, "Type de poids requis"),
  weight: z.string().min(1, "Poids requis"),
  box: z.coerce.number().min(1, "La caisse doit contenir au moins 1"),
  box_type: z.nativeEnum(Box_type),
  wrapping_type: z.nativeEnum(Wrapping_type),
  quality_id: z.number().min(1, { message: "Le qualite est requis" }),
});
export const shippingWeightFishSchema = z.object({
  id: z.number().optional(),
  weight: z.string().min(1, "Poids requis"),
  box: z.coerce.number().min(1, "La caisse doit contenir au moins 1"),
  quality_id: z.number().min(1, { message: "Le qualite est requis" }),

  wrapping_weight_type_id: z.number().min(1),
  pallet_id: z.number().optional(),
  box_type: z.nativeEnum(Box_type),
  wrapping_type: z.nativeEnum(Wrapping_type),
});
export const supplierFormSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
});
export const campanyFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
});

export const invoiceFormSchema = z.object({
  total_weight: z.coerce.number().min(1, "Le total de poids est obligatoire"),
  trace_code: z.string().min(1, "Le numero etat tracablite est obligatoire"),
  company_id: z.coerce.number().min(1, "La marayeur est requise"),
});
export const receptionPriceFormSchema = z.object({
  price_kg: z.coerce.number().min(1, "Le prix doit être au minimum de 1."),
});
export const receptionPaidPriceFormSchema = z.object({
  paid_price: z.coerce.number(),
});
export const categoryFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  // .refine(async (name) => !(await categoryNameExists(name)), {
  //   message: "Ce nom de catégorie existe déjà.",
  // }),
});
export const weightTypeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});
// auth
export const loginFormSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const userFormSchema = z.object({
  username: z.string().min(3, { message: "Nom d'utilisateur trop court" }),
  email: z.string().email({ message: "Email invalide" }),
  auth_allowed: z.boolean().optional(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      "Le mot de passe doit contenir une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
    ),
  role_id: z.coerce.number().min(1, "Rôle requis"),

  // Person
  firstname: z.string().min(2, { message: "Prénom requis" }),
  lastname: z.string().min(2, { message: "Nom requis" }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  gender: z
    .enum(["MALE", "FEMALE"], {
      errorMap: () => ({ message: "Genre invalide" }),
    })
    .optional(),
  date_of_birth: z.coerce.date().optional(),

  person_id: z.number().optional(),
});
export const permissionFormSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  category_id: z.coerce.number().min(1, "Catégorie requise"),
});
// .refine(async (category_id) => !(await categoryNameExists(category_id)), {
//   message: "Category does not exist",
// }),
export const roleFormSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  // permissions: z.array(z.coerce.number().min(1, "Permission requise")),
});
export const permissionCategoryFormSchema = z.object({
  name: z.string().min(1, "Nom requis"),
});
export const wrappingFormSchema = z.object({
  id: z.number().optional(),
  client_id: z.coerce.number().min(1, "Client requis"),
  weigher_id: z.coerce.number().min(1, "Peseur requis"),
  fish_category_id: z.coerce.number().min(1, "Catégorie de poisson requise"),
  storage_location: z.string().optional(),
  isFinished: z.boolean().optional(),
  isValid: z.boolean().optional(),
});
export const clientFormSchema = z.object({
  firstname: z.string().min(1, "Prénom requis"),
  lastname: z.string().min(1, "Nom requis"),
  role_id: z.number().min(1, "Rôle requis"),
  client_type: z.enum(["STOCK", "BUYER", "SUPPLIER"]).optional(),
});

export const receptionWrappingSchema = z.object({
  reception_id: z.coerce.number().min(1, "Réception requise"),
  wrapping_id: z.coerce.number().min(1, "Emballage requis"),
});

export const shippingFormSchema = z.object({
  id: z.number().optional(),
  client_id: z.coerce.number().min(1, "Client requis"),
  weigher_id: z.coerce.number().min(1, "Peseur requis"),
  plate_number: z
    .string()
    .min(4, "Le numéro de plaque doit comporter au moins 4 caractères"),
  isValid: z.boolean().optional().default(false),
  isFinished: z.boolean().optional().default(false),
});
export const shippingFishCategorySchema = z.object({
  id: z.number().optional(),
  shipping_id: z.number().min(1),
  fish_category_id: z.number().min(1),
});
export const qualitySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Titre requis" }),
  code: z.string().min(1, { message: "Code requis" }),
});

export const palletSchema = z.object({
  id: z.number().optional(),
  shipping_id: z.number().min(1),
  pallet_number: z.number().optional(),
  is_closed: z.boolean().optional(),
  is_validated: z.boolean().optional(),
});

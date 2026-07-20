import { Gender } from "@prisma/client";

export const receptionDefaultValues = {
  supplier_id: "" as unknown as number,
  plate_number: "",
  origin: "",
  fish_category: "",
  tare_weight: "" as unknown as number,
};
export const receptionWFDefaultValues = {
  weight: "",
  crate: "" as unknown as number,
  weight_type_id: "" as unknown as number,
  quality_id: "" as unknown as number,
};
export const invoiceDefaultValues = {
  total_weight: "" as unknown as number,
  trace_code: "",
  company_id: "" as unknown as number,
};
export const Role = {
  ADMIN: "ADMIN",
  SUPPLIER: "SUPPLIER",
  WEIGHER: "WEIGHER",
} as const;

export const categoryDefaultValues = {
  name: "",
  img_url: "",
};

export const userDefaultValues = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
  phone_number: "",
  address: "",
  email: "",

  gender: Gender.MALE,
  date_of_birth: new Date(),
  auth_allowed: false,
  role_id: "" as unknown as number,
};
export const wrappingWFDefaultValues = {
  weight: "",
  box: "" as unknown as number,
  weight_type_id: "" as unknown as number,
};

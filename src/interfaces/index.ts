import {
  Box_type,
  Client_type,
  InvoiceStatus,
  Wrapping_type,
} from "@prisma/client";
export interface IReception {
  id: number;
  supplier_id: number;
  fish_category_id: number;
  weigher_id: number;
  plate_number: string;
  origin: string;
  tare_weight: number;
  paid_price?: number;
  total_price?: number;
  final_price?: number; // <=== total price + untraced_price_kg * (total_weight_trace  - total_weight_net)
  total_weight_net?: number;
  total_weight_trace?: number;
  isTrace: boolean; //if this reception was just to add invoice of traceability
  isFinished: boolean;
  isValid: boolean;
  is_wrapped: boolean;
  weight_taken_in_wrapping?: number;
  isFinished_add_trace: boolean;
  untraced_price_kg?: number;
  invoiceStatus: InvoiceStatus;
  created_at: Date;
  updated_at?: Date | null;
  weigher?: IUser;
  supplier?: ISupplier;
  reception_weight_fish?: IReceptionWeightFish[];
  fish_category?: ICategory;
  invoices?: IInvoice[];
}

export interface IWrapping {
  id: number;
  client_id: number;
  fish_category_id: number;
  weigher_id: number;
  storage_location?: string;
  isFinished: boolean;
  isValid: boolean;
  total_weight?: number;
  total_weight_receptions?: number;
  created_at: Date;
  updated_at?: Date | null;
  fish_category?: ICategory;
  client?: IClient;
  weigher?: IUser;
  wrapping_weight_fish?: IWrappingWeightFish[];
  reception_wrapping?: IReceptionWrapping[];
}
export interface IReceptionWrapping {
  id: number;
  reception_id: number;
  wrapping_id: number;
  reception: IReception;
  wrapping: IWrapping;
}
export interface ICategory {
  id: number;
  name: string;
  img: Uint8Array;
  created_at: Date;
  updated_at: Date | null;
  weight_type?: IWeightType[];
  wrapping_weight_type?: IWrappingWeightType[];
  reception?: IReception[];
}

export interface IReceptionWeightFish {
  id: number;
  weight: number;
  crate: number;
  quality_id: number;
  created_at: Date;
  updated_at?: Date | null;
  reception_id: number;
  weight_type_id: number;
  reception?: IReception;
  weight_type?: IWeightType;
  quality?: IQuality;
}
export interface IWrappingWeightFish {
  id: number;
  weight: number;
  box: number;
  box_type: Box_type;
  quality_id: number;
  wrapping_type: Wrapping_type;
  created_at: Date;
  updated_at?: Date | null;
  wrapping_id: number;
  wrapping_weight_type_id?: number;
  wrapping?: IWrapping;
  wrapping_weight_type?: IWrappingWeightType;
  quality?: IQuality;
}
export interface IShipping {
  id: number;
  client_id: number;
  weigher_id: number;
  plate_number: string;
  isValid: boolean;
  isFinished: boolean;
  total_weight?: number;
  total_pallets?: number;
  created_at: string;
  updated_at: string;
  client?: IClient;
  weigher?: IUser;
  shipping_Fish_category?: IShippingFishCategory[];
}
export interface IShippingWeightFish {
  id: number;
  weight: number;
  box: number;
  box_type: Box_type;
  wrapping_type: Wrapping_type;
  shipping_Fish_category_id: number;
  created_at: Date;
  updated_at?: Date | null;
  shipping_id: number;
  pallet_id: number;
  quality_id: number;
  shipping_weight_type_id?: number;
  shipping?: IShipping;
  wrapping_weight_type?: IWrappingWeightType;
  pallet?: IPallet;
  quality?: IQuality;
  shipping_Fish_category?: IShippingFishCategory;
}
export interface IShippingFishCategory {
  id: number;
  shipping_id: number;
  fish_category_id: number;
  shipping?: IShipping;
  fish_category?: ICategory;
  shipping_weight_fish?: IShippingWeightFish[];
}

export interface IWeightType {
  id: number;
  name: string;
  order: number;
  fish_category_id: number;
  created_at: Date;
  updated_at?: Date | null;
}
export interface IWrappingWeightType {
  id: number;
  name: string;
  order: number;
  fish_category_id: number;
  created_at: Date;
  updated_at?: Date | null;
}
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  auth_allowed: boolean;
  person_id: number;
  person?: IPerson;
  role_id: number;
  role?: IRole;
  soft_delete: boolean;
}
export interface IPerson {
  id: number;
  firstname: string;
  lastname: string;
  phone_number?: string;
  adress?: string;
  gender?: Gender;
  date_of_birth?: Date;
  created_at: Date;
  updated_at: Date | null;
  soft_delete: boolean;
  user?: IUser;
  supplier?: ISupplier;
  client?: IClient;
}

export interface IClient {
  id: number;
  client_type: Client_type;
  person_id: number;
  created_at: Date;
  updated_at?: Date | null;
  person?: IPerson;
}
export interface ISupplier {
  id: number;
  person_id: number;

  created_at: Date;
  updated_at?: Date | null;
  person?: IPerson;
}

export interface ICompany {
  id: number;
  name: string;
  code: string;
}

export interface IInvoice {
  id: number;
  total_weight: number;
  created_at: Date;
  updated_at?: Date | null;
  trace_code: string;
  supplier_id: number;
  reception_id: number;
  company_id: number;
  company: ICompany;
  reception: IReception;
  supplier: ISupplier;
}
export interface IRole {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  permissions?: IPermission[];
  persons?: IPerson[];
  created_at: Date;
  updated_at?: Date | null;
}
export interface IPermissionCategory {
  id: number;
  name: string;
  permissions: IPermission[];
}
export interface IPermission {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  is_active?: boolean;
  created_at: Date;
  updated_at?: Date | null;
  roles: IRole[];
  category?: IPermissionCategory;
}

export interface IQuality {
  id: number;
  title: string;
  code: string;
  created_at: string;
  updated_at: string | null;
}

export interface IPallet {
  id: number;
  shipping_id: number;
  pallet_number: number;
  is_closed: boolean;
  is_validated: boolean;
  created_at: string;
  updated_at: string | null;
  shipping_weight_fish?: IShippingWeightFish[];
  shipping?: IShipping;
}

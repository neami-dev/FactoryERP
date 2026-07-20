import { Gender, InvoiceStatus } from "@prisma/client";

// ====== RECEPTION PARAMS
export type CreateReceptionParams = {
  weigher_id: number;
  reception: {
    supplier_id: number;
    plate_number: string;
    fish_category_id: number;
    origin: string;
    isTrace?: boolean;
    tare_weight: number;
    isFinished?: boolean;
  };
  path: string;
};

export type UpdateReceptionParams = {
  reception: {
    id: number;
    supplier_id?: number;
    plate_number?: string;
    weigher_id?: number;
    fish_category_id?: number;
    origin?: string;
    isFinished?: boolean;
    isFinished_add_trace?: boolean;
    isValid?: boolean;
    is_wrapped?: boolean;
    weight_taken_in_wrapping?: number;
    total_price?: number;
    paid_price?: number;
    crate_number?: number;
    price_kg?: number;
    untraced_price_kg?: number;
    invoiceStatus?: InvoiceStatus;

    created_at?: Date;
    updated_at?: Date | null;
  };
  path: string[];
};

// ====== Fish Category Params
export type CreateFishCategoryParams = {
  category: {
    name: string;
    img: Uint8Array;
  };
  path: string;
};

export type DeleteFishCateoryParams = {
  id: number;
  path: string;
};

export type UpdateFishCategoryParams = {
  category: {
    id: number;
    name?: string;
    img?: Uint8Array;
  };
  path: string;
};

// ====== reception weight params
export type CreateReceptionWFParams = {
  reception_id: number;
  reception_weight_fish: {
    weight_type_id: number;
    weight: string;
    crate: number;
    quality_id: number;
  };
  paths: string[];
};

export type UpdateReceptionWFParams = {
  reception_weight_fish: {
    weight_type_id?: number;
    id: number;
    weight?: string;
    crate?: number;
    price_kg?: number;
    quality_id?: number;
  };
  path: string;
};
export type UpdateRWFByRecptionParams = {
  reception_weight_fish: {
    weight_type_id?: number;
    id: number;
    weight?: number;
    crate?: number;
    price_kg?: number;
  };
  path: string;
  reception_id: number;
};
// ===== supplier params
export type CreateSupplierParams = {
  supplier: {
    firstname: string;
    lastname: string;
  };
  path: string;
};

//  ====== company params
export type CreateCompanyParams = {
  company: {
    name: string;
    code: string;
  };
  path: string;
};

// ===== invoice params
export type CreateInvoiceParams = {
  invoice: {
    trace_code: string;
    total_weight: number;
    company_id: number;
  };
  reception_id: number;
  path: string;
};

export type UpdateInvoiceParams = {
  invoice: {
    id: number;
    trace_code?: string;
    total_weight?: number;
    company_id?: number;
  };
  reception_id?: number;
  path: string;
};

// ===== rception pricing params
export type CreatereceptionPrice = {
  reception_price: {
    price_kg: number;
  };
  reception_id: number;
  weight_type_name: string;
  path: string;
};

export type CreateWeightTypeParams = {
  weighType: {
    name: string;
    order?: number;
  };
  fish_category_id: number;
  path: string;
};
export type UpdateWeightTypeParams = {
  weighType: {
    id: number;
    name?: string;
    order?: number;
  };
  path: string;
};
export type CreatePersonParams = {
  person: {
    firstname: string;
    lastname: string;
    phone_number?: string;
    address?: string;
    gender?: Gender;
    date_of_birth?: Date;
    username: string;
    email: string;
    password: string;
    role_id: number;
  };
  path: string;
};
export interface CreateRoleParams {
  role: {
    name: string;
  };
  path: string;
}

export interface UpdateRoleParams {
  id: number;
  role: {
    name: string;
  };
  path: string;
}
export type WrappingTypeBreakdown = {
  type: string;
  pallets: number;
  weight: number;
  boxes: number;
};

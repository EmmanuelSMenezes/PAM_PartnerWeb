export interface IBranchList {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: Address;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  active: boolean;
  ratings: number;
}

export interface Address {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  latitude: string;
  longitude: string;
}

export interface IBranchByPartner {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: IBranchByPartnerAdress;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  active: boolean;
  ratings: number;
}

export interface IBranchByPartnerAdress {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  latitude: string;
  longitude: string;
}

export interface IBranchByPartnerPagination {
  totalRows: number;
  totalPages: number;
}

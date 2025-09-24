export interface BranchCreate {
  branch_name: string;
  document: string;
  phone: string;
  address: AddressCreate;
}

export interface AddressCreate {
  street: string;
  number: string;
  complement: string | undefined;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_by: string;
  latitude: string;
  longitude: string;
}

export interface IResponsePartner {
  partner_id: string;
  identifier: any;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch: Branch[];
  user_id: string;
  admin_id: string;
  avatar: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export interface Branch {
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
  ratings: string;
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

export interface IPartnerById {
  partner_id: string;
  // identifier: number;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch: BranchById[];
  user_id: string;
  admin_id: string;
  // avatar: string;
  active: boolean;
  // ratings: RatingById[];
  created_by: string;
  updated_by: string;
}

export interface BranchById {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: AddressById;
  // created_by: string;
  // created_at: string;
  updated_by: string;
  // updated_at: string;
}

export interface AddressById {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  // created_by: string;
  // created_at: string;
  updated_by: string;
  // updated_at: string;
  latitude: string;
  longitude: string;
}

export interface RatingById {
  rating_value: number;
  note: string;
  created_at: string;
}

export interface IUpdatePartner {
  partner_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch: BranchUpdate[];
  updated_by: string;
  user_id: string;
  admin_id: string;
  active: boolean;
}

export interface BranchUpdate {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: AddressUpdate;
  updated_by: string;
}

export interface AddressUpdate {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  updated_by: string;
  latitude: string;
  longitude: string;
}

export interface IPaginations {
  totalRows: number;
  totalPages: number;
}

export interface IPartner {
  partner_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  identifier: number;
  email: string;
  phone_number: string;
  branch: BranchList[];
  user_id: string;
  active: boolean;
  created_by: string;
  deleted_by: string;
  avatar: File;
}

export interface BranchList {
  branch_id: string;
  branch_name: string;
  document: string;
  address: AddressList;
  partner_id: string;
}

export interface AddressList {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
  latitude: string;
  longitude: string;
}

export interface IBankAccount {
  bank_details_id: string;
  partner_id: string;
  bank: string;
  agency: string;
  account_id: string;
  account_number: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IBanckAccountUpdate {
  bank_details_id?: string;
  partner_id?: string;
  bank: string | undefined;
  agency: string;
  account_id: string;
  account_number: string;
  active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

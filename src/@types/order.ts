export interface OrderParams {
  partner_id: string;
  order_number?: string;
  status?: string;
  consumer?: string;
  filial?: string;
  page?: string | number;
  itensPerPage?: string | number;
  start_date?: Date | string;
  end_date?: Date | string;
}

export interface IOrderDetails {
  order_id: string;
  order_number: number;
  freight: number;
  amount: number;
  service_fee: number;
  card_fee: number;
  change: number;
  order_status_id: string;
  status_name: string;
  observation: string;
  consumer: Consumer;
  partner: Partner;
  shipping: Shipping;
  order_itens: OrderIten[];
  payments: Payment[];
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface Consumer {
  user_id: string;
  consumer_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  street: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  district: string;
  zip_code: string;
}

export interface Partner {
  user_id: string;
  partner_id: string;
  identifier: number;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch_id: string;
  branch_name: string;
  phone: string;
}

export interface Shipping {
  shipping_company_id: string;
  company_name: string;
  document: string;
  address_id: string;
  address: Address;
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
  created_at: string;
  updated_at: string;
  latitude: string;
  longitude: string;
}

export interface OrderIten {
  order_item_id: string;
  product_name: string;
  quantity: number;
  product_value: number;
  product_id: string;
  image_default: string;
  url: string;
}

export interface Payment {
  payment_id: string;
  payment_options_id: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  installments: number;
  amount_paid: number;
  payment_situation_id: string;
  description: string;
  identifier: number;
}

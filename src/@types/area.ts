export type IArea = {
  type: string;
  geometry: {
    type: string;
    coordinates: string[];
  };
  properties: {
    name: string;
    actuation_area_id: string;
    partner_id: string;
    active: boolean;
    branch_id: string;
  };
};

export interface IAreaList {
  partner_id: string;
  filter?: string;
  page: number;
  itensPerPage: number;
}

export type IGeoJSON<T> = {
  type: string;
  features: Feature<T>[];
};

export type Feature<T> = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: T;
};

export type PropertiesActuationArea = {
  name?: string;
  partner_id?: string;
  actuation_area_id?: string;
  created_by?: string;
  updated_by?: string;
  active?: boolean;
  created_at?: string;
  branch_id: string;
  updated_at?: string;
};

export type DeleteAreaParams = {
  id: string[];
};

export interface IAreaDelivery {
  delivery_option_id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IAreaConfigById {
  value_minimum: string;
  actuation_area_config_id: string;
  actuation_area_id: string;
  start_hour: string;
  end_hour: string;
  payment_options: PaymentOption[];
  working_days: any;
  shipping_options: ShippingOption[];
  created_by: string;
  created_at: string;
  value_minimum_standard: number;
  updated_by: string;
  updated_at: string;
}

export interface PaymentOption {
  actuation_area_payments_id: string | null;
  payment_options_id: string;
  description: string;
}

export interface WorkingDay {
  working_day_id: any;
  day_number: number;
}

export interface ShippingOption {
  actuation_area_id: any;
  actuation_area_shipping_id: string;
  delivery_option_id: string;
  name: string;
  shipping_free: boolean;
  value: number;
}

export interface Root {
  actuation_area_config_id: string;
  actuation_area_id: string;
  payment_local_id: string;
  value_minimum: number;
  start_hour: string;
  end_hour: string;
  working_day: WorkingDays[];
  payment: Payment[];
  shipping_options: ShippingOptions[];
}

export interface WorkingDays {
  working_day_id: string;
  day_number: number;
}

export interface Payment {
  actuation_area_payments_id: string;
  payment_options_id: string;
}

export interface ShippingOptions {
  actuation_area_shipping_id: string;
  delivery_option_id: string;
  shipping_free: boolean;
  value: number;
}

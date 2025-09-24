export interface IAreaShippingCreate {
  actuation_area_id: any;
  start_hour: string;
  end_hour: string;
  working_day: number[] | any;
  payment: string[];
  shipping_options: ShippingOption[];
}

export interface ShippingOption {
  shipping_free: boolean;
  delivery_options_id: string;
  value: number;
}

export interface PaymentParams {
  payment_options_id?: string;
  identifier?: number;
  description?: string;
  value_minimum?: number;
  page: number;
  itensPerPage: number;
}

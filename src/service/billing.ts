import { PaymentParams, IAreaShippingCreate } from 'src/@types/billing';
import { apiBilling, apiLogistics } from 'src/utils/axios';

export const getPayment = async ({ page, itensPerPage }: PaymentParams) => {
  const response = await apiBilling.get('/payment', {
    params: {
      page,
      itensPerPage,
    },
  });
  return response.data.data;
};

export const getValueMinimum = async (partner_id: string) => {
  const response = await apiBilling.get('/payment/value-minimum', { params: { partner_id } });
  return response.data.data;
};

export const areaShippingCreate = async ({
  actuation_area_id,
  start_hour,
  end_hour,
  working_day,
  payment,
  shipping_options,
}: IAreaShippingCreate) => {
  const data = {
    actuation_area_id,
    start_hour,
    end_hour,
    working_day,
    payment,
    shipping_options,
  };
  const response = await apiLogistics.post('/actuation-area-shipping/create', data);
  return response.data.data;
};

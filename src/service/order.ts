import { OrderParams } from 'src/@types/order';
import { apiOrder } from 'src/utils/axios';

export const getOrderByPartner = async ({
  partner_id,
  order_number,
  status,
  consumer,
  filial,
  page,
  itensPerPage,
  start_date,
  end_date,
}: OrderParams) => {
  const response = await apiOrder.get(`/order/bypartner/${partner_id}`, {
    params: {
      partner_id,
      order_number,
      status,
      consumer,
      filial,
      page,
      itensPerPage,
      start_date,
      end_date,
    },
  });
  return response.data.data;
};

export const getOrderDetails = async (order_id: string) => {
  const response = await apiOrder.get(`/order/details/${order_id}`);
  return response.data.data;
};

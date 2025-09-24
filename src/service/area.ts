import {
  DeleteAreaParams,
  IAreaConfigById,
  IAreaDelivery,
  IAreaList,
  IGeoJSON,
  PropertiesActuationArea,
} from 'src/@types/area';
import { apiLogistics } from 'src/utils/axios';

export const createMapArea = async (data?: IGeoJSON<PropertiesActuationArea>) => {
  const response = await apiLogistics.post('/actuation-area/create', data);
  return response.data.data;
};

export const getAreaByPartnerId = async ({ partner_id, filter, page, itensPerPage }: IAreaList) => {
  const response = await apiLogistics.get('/actuation-area/getByPartnerId', {
    params: {
      partner_id,
      filter,
      page,
      itensPerPage,
    },
  });
  return response.data.data;
};

export const deleteArea = async (id: string[]): Promise<DeleteAreaParams> => {
  const response = await apiLogistics.delete('/actuation-area/delete', { data: id });
  return response.data.data;
};

export const updateArea = async (data?: IGeoJSON<PropertiesActuationArea>) => {
  const response = await apiLogistics.put('/actuation-area/update', data);
  return response.data.data;
};

export const areaDelivery = async (): Promise<IAreaDelivery[]> => {
  const response = await apiLogistics.get('/actuation-area-shipping');
  return response.data.data;
};

export const getAreaConfigById = async (actuation_area_id: string): Promise<IAreaConfigById> => {
  const response = await apiLogistics.get('/actuation-area/getAreaConfigByActuationAreaId', {
    params: { actuation_area_id },
  });
  return response.data.data;
};

export const updateAreaConfig = async ({
  actuation_area_config_id,
  actuation_area_id,
  start_hour,
  end_hour,
  working_day,
  pagseguro_value_minimum_id,
  payment_local_id,
  value_minimum,
  payment,
  shipping_options,
}: any) => {
  const data = {
    actuation_area_config_id,
    actuation_area_id,
    start_hour,
    payment_local_id,
    pagseguro_value_minimum_id,
    value_minimum,
    end_hour,
    working_day,
    payment,
    shipping_options,
  };
  const response = await apiLogistics.put('/actuation-area-shipping/Update', data);
  return response.data.data;
};

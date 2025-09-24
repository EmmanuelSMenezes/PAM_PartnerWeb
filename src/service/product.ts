import {
  ProductCreateParams,
  ProductDeleteParam,
  ProductListParams,
  iProductImage,
} from 'src/@types/product';
import { apiCatalog } from 'src/utils/axios';

export const getProducts = async ({ branch_id, page, filter, itensPerPage }: ProductListParams) => {
  const response = await apiCatalog.get(`/partner/product/get/baseproduct/${branch_id}`, {
    params: {
      branch_id,
      page,
      filter,
      itensPerPage,
    },
  });
  return response.data.data;
};

export const productCreate = async ({
  base_product_id,
  branch_id,
  name,
  description,
  price,
  active,
  created_by,
}: ProductCreateParams) => {
  const data = {
    base_product_id,
    branch_id,
    name,
    description,
    price,
    active,
    created_by,
  };
  const response = await apiCatalog.post('/partner/product/create', data);
  return response.data.data;
};

export const getProductByPartner = async ({
  branch_id,
  filter,
  page,
  itensPerPage,
}: ProductListParams) => {
  const params = new URLSearchParams();
  params.append('branch_id', String(branch_id));
  params.append('page', String(page));
  params.append('itensPerPage', String(itensPerPage));
  params.append('filter', String(filter));

  const response = await apiCatalog.get(`/partner/product/${branch_id}`, {
    params,
  });
  return response.data.data;
};

export const getProductUpdate = async ({
  branch_id,
  product_id,
  name,
  description,
  price,
  sale_price,
  active,
  reviewer,
  updated_by,
}: ProductCreateParams) => {
  const data = {
    branch_id,
    sale_price,
    product_id,
    name,
    description,
    reviewer,
    price,
    active,
    updated_by,
  };
  const response = await apiCatalog.put('/partner/product/update', data);
  return response.data.data;
};

export const getDeleteProduct = async (product_id: string): Promise<ProductDeleteParam> => {
  const response = await apiCatalog.delete(`/partner/product/${product_id}`, {
    params: {
      product_id,
    },
  });
  return response.data.data;
};

export const getCreateImage = async (data: iProductImage): Promise<ProductCreateParams> => {
  const formData = new FormData();

  if (data.images) {
    data.images.forEach((image) => {
      if (image instanceof File || typeof image === 'string') {
        formData.append('images', image);
      }
    });
  }
  formData.append('partner_id', data.partner_id || '');
  formData.append('product_id', data.product_id || '');
  formData.append('imagedefaultname', data.imagedefaultname || '');

  const response = await apiCatalog.post('/partner/product/image/create', formData);
  return response.data.data;
};

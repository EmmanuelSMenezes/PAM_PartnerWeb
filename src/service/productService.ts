import { iNewProductResponse, iProductImage, iProductServicePost } from 'src/@types/productService';
import { apiCatalog } from 'src/utils/axios';

export const postProductService = async ({
  name,
  description,
  categoryGroup,
  minimum_price,
  note,
  created_by,
  type,
  admin_id,
}: iProductServicePost): Promise<iNewProductResponse> => {
  const response = await apiCatalog.post('/product/create', {
    name,
    description,
    category: categoryGroup,
    minimum_price,
    note,
    created_by,
    type,
    admin_id,
  });
  return response.data.data;
};

export const postProductImage = async (data: iProductImage): Promise<iNewProductResponse> => {
  const formData = new FormData();
  formData.append('Image', data.Image);
  formData.append('product_id', data.product_id);

  const response = await apiCatalog.post('/product/image/create', formData);
  return response.data.data;
};

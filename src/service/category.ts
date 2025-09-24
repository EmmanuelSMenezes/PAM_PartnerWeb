import { iCategoryPage } from 'src/@types/category';
import { iFilterPagination } from 'src/@types/filter';
import { apiCatalog } from 'src/utils/axios';

export const category = async ({
  itensPerPage,
  page,
  filter,
}: iFilterPagination): Promise<iCategoryPage[]> => {
  const params = new URLSearchParams();
  params.set('filter', String(filter));
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await apiCatalog.get('/category/get', { params });
  return response.data.data;
};

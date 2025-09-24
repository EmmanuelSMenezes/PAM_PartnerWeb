import { IBanckAccountUpdate, IResponsePartner, IUpdatePartner } from 'src/@types/partner';
import {
  CreateBranch,
  IBranchByPartner,
  IGetBranch,
  IBranch,
  CreateBankAccount,
} from 'src/@types/user';
import { apiPartner } from 'src/utils/axios';

export const getPartnerById = async (user_id: string): Promise<IResponsePartner> => {
  const response = await apiPartner.get(`/partner/partnerby/${user_id}`);

  return response.data.data;
};

export const createBranch = async ({
  branch_name,
  document,
  phone,
  address,
  partner_id,
}: CreateBranch) => {
  const data = {
    branch_name,
    document,
    phone,
    address,
    partner_id,
  };
  const response = await apiPartner.post('/branch/create', data);

  return response.data.data;
};

export const getBranch = async (): Promise<IGetBranch> => {
  const response = await apiPartner.get('/branch');
  return response.data.data;
};

export const getBranchByPartner = async ({
  partner_id,
  page,
  filter,
  itensPerPage,
}: IBranchByPartner) => {
  const response = await apiPartner.get(`/branch/${partner_id}`, {
    params: {
      page,
      filter,
      itensPerPage,
    },
  });

  return response.data.data;
};

export const getBranchUpdate = async ({
  branch_id,
  branch_name,
  document,
  phone,
  partner_id,
  updated_by,
  address,
}: IBranch) => {
  const data = {
    branch_id,
    phone,
    partner_id,
    updated_by,
    branch_name,
    document,
    address,
  };
  const response = await apiPartner.put('/branch/update', data);
  return response.data.data;
};

export const getBranchDelete = async (id: string[]): Promise<IGetBranch> => {
  const response = await apiPartner.delete('/branch/delete', { data: id });
  return response.data.data;
};

export const updatePartner = async (partner: IUpdatePartner): Promise<IResponsePartner> => {
  const response = await apiPartner.put('/partner/update', partner);
  return response.data.data;
};

export const createBankAccount = async ({
  partner_id,
  bank,
  agency,
  account_number,
  account_id,
}: CreateBankAccount) => {
  const data = {
    partner_id,
    bank,
    agency,
    account_number,
    account_id,
  };
  const response = await apiPartner.post('/create', data);
  return response.data.data;
};

export const updateBankAccount = async ({
  bank_details_id,
  bank,
  agency,
  account_number,
  account_id,
  active,
}: IBanckAccountUpdate) => {
  const data = {
    bank_details_id,
    bank,
    agency,
    account_number,
    account_id,
    active,
  };
  const response = await apiPartner.put('/update', data);
  return response.data.data;
};

export const getBankAccount = async (partner_id: string) => {
  const response = await apiPartner.get('/partner_id/', {
    params: {
      partner_id,
    },
  });

  return response.data.data;
};

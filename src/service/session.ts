import { ISession, ForgotPasswordParams, ResetPasswordParams } from 'src/@types/user';
import { IPartnerAvatar, PartnerAvatarParams } from 'src/@types/product';
import { apiAuth } from '../utils/axios';

export const createSession = async (email: string, password: string): Promise<ISession> => {
  const response = await apiAuth.post('/session/create', {
    roleName: 3,
    email,
    password,
    phone: '',
  });
  return response.data.data;
};

export const forgotPassword = async ({ email }: ForgotPasswordParams) => {
  const response = await apiAuth.get('/user/forgot-password', {
    params: {
      email,
      userRole: 3,
    },
  });

  return response.data.data;
};

export const resetPassword = async ({
  token,
  password,
  passwordConfirmation,
}: ResetPasswordParams) => {
  const response = await apiAuth.post(
    '/user/reset-password',
    {
      password,
      passwordConfirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const getUpdateUser = async (data: IPartnerAvatar): Promise<PartnerAvatarParams> => {
  const formData = new FormData();

  formData.append('User_id', String(data.user_id));
  formData.append('Email', String(data.email));
  formData.append('Avatar', data?.avatar);
  formData.append('FullName', String(data.fullName));
  formData.append('Document', String(data.document));
  formData.append('Phone', String(data.phone));

  const response = await apiAuth.put('/user/update', formData);
  return response.data.data;
};

export const getPartnerStyle = async (admin_id: string) => {
  const response = await apiAuth.get(`/settings/style/get/admin/${admin_id}`);
  return response.data.data;
};

import {
  ICollaborator,
  INewCollaborator,
  ICollaboratorUpdate,
  ICollaboratorList,
} from 'src/@types/collaborator';
import { apiAuth } from 'src/utils/axios';

export const getCollaborators = async (
  sponsor_id: string,
  filter: string,
  page: any = 1,
  itensPerPage: any = 5
): Promise<ICollaboratorList> => {
  const response = await apiAuth.get('collaborator/list', {
    params: new URLSearchParams([
      ['sponsor_id', sponsor_id],
      ['page', String(page)],
      ['itensPerPage', String(itensPerPage)],
      ['filter', filter],
    ]),
  });
  return response.data.data;
};

export const createCollaborator = async ({
  sponsor_id,
  fullname,
  document,
  email,
}: INewCollaborator): Promise<ICollaborator> => {
  const data = {
    roleName: 3,
    sponsor_id,
    fullname,
    document,
    email,
  };
  const response = await apiAuth.post(`collaborator/create`, data);
  return response.data.data;
};

export const deleteCollaborator = async (collaborators: string[]): Promise<any> => {
  const response = await apiAuth.delete('collaborator/delete', { data: collaborators });
  return response.data.data;
};

export const updateCollaborator = async (collaborators: ICollaboratorUpdate[]): Promise<any> => {
  const response = await apiAuth.put('collaborator/update', collaborators);
  return response.data.data;
};

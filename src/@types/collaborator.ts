export interface ICollaboratorList {
  collaborators: ICollaborator[];
  pagination?: Pagination;
}

export interface Pagination {
  totalRows: any;
  totalPages: any;
}

export interface ICollaborator {
  collaborator_id: string;
  user_id: string;
  sponsor_id: string;
  fullname: string;
  email: string;
  active: boolean;
  created_by: string;
  updated_by: string;
  profile: Profile;
  role: Role;
}

export interface Profile {
  profile_id: string;
  fullname: string;
  avatar: string;
  document: string;
  active: boolean;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  user_id: string;
}

export interface Role {
  role_id: string;
  description: string;
  tag: string;
  active: boolean;
  created_at: string;
  deleted_at: string;
  updated_at: string;
}

export interface INewCollaborator {
  sponsor_id: string;
  fullname: string;
  document: string;
  email: string;
}

export interface ICollaboratorUpdate {
  collaborator_id: string;
  active: boolean;
}

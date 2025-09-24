// ----------------------------------------------------------------------

import { CustomFile } from 'src/components/upload';

export interface ISession {
  admin_id: string;
  user: {
    user_id: string;
    email: string;
    phone: string;
    active: boolean;
    role_id: string;
    password_generated: boolean;
    last_login: string;
    created_at: string;
    deleted_at: string;
    updated_at: string;
    role: {
      role_id: string;
      description: string;
      tag: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
    };
    profile: {
      profile_id: string;
      fullname: string;
      avatar: string;
      document: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
      user_id: string;
    };
    isCollaborator?: boolean;
    isActiveCollaborator?: boolean;
    sponsor_id?: string;
  };
  token: string;
}

export interface PersonalDataForm {
  user_id?: string;
  avatar: CustomFile | string | null;
  fullName: string;
  email: string;
  phone: string;
  document: string;
}

export interface CreateBankAccount {
  partner_id: string;
  bank: string | undefined;
  agency: string;
  account_number: string;
  account_id: string;
}

export interface CreateBranch {
  branch_name: string;
  document: string;
  phone?: string;
  address: {
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    created_by: string | null;
    updated_by?: string;
    active?: true;
    latitude: string;
    longitude: string;
  };
  partner_id: string | null;
}

export interface IGetBranch {
  branch_id: string;
  branch_name: string;
  id?: string;
  phone?: string;
  active?: boolean;
  updated_by?: string | null;
  document: string;
  address: IAddress;
  branches?: IBranch[];
}

export interface IBranch {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: IAddress;
  updated_by: string;
}

export interface IAddress {
  address_id?: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active?: boolean;
  updated_by?: string;
  latitude?: string;
  longitude?: string;
}

export interface IBranchByPartner {
  partner_id: string;
  page: number;
  filter: string;
  itensPerPage: number;
}

export interface IPartner {
  admin_id(arg0: string, admin_id: any): unknown;
  partner_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch: [
    {
      branch_name: string;
      document: string;
      address: {
        street: string;
        number: string;
        complement: string;
        district: string;
        city: string;
        state: string;
        zip_code: string;
        active: boolean;
        created_at: string;
        deleted_at: string;
        updated_at: string;
        latitude: string;
        longitude: string;
      };
      partner_id: string;
    }
  ];
  user_id: string;
  active: boolean;
  created_by: string;
  deleted_by: string;
}

export type IPartnerId = {
  userId?: string;
};

export type IUser = {
  user_id?: string;
  email: string;
  admin_id?: string;
  phone?: string;
  active?: boolean;
  role_id?: string;
  password_generated?: boolean;
  last_login?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  role: {
    role_id: string;
    description: string;
    tag: string;
    active: boolean;
    created_at: string;
    deleted_at: string;
    updated_at: string;
  };
  profile: {
    profile_id: string;
    fullname: string;
    avatar: string;
    document: string;
    active: boolean;
    created_at: string;
    deleted_at: string;
    updated_at: string;
    user_id: string;
  };
};

export type UserSessionProps = {
  email: string;
  password: string;
  phone: string;
  roleName: number;
};

export type ForgotPasswordParams = {
  token: string;
  email: string;
  roleName: number;
};

export type ResetPasswordParams = {
  token?: string;
  password: string;
  passwordConfirmation: string;
};

export type IUserSocialLink = {
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type IUserProfileFollowers = {
  follower: number;
  following: number;
};

export type IUserProfileCover = {
  name?: string;
  cover: string;
  role: string;
};

export type IUserProfileAbout = {
  quote: string;
  country: string;
  email: string;
  role: string;
  company: string;
  school: string;
};

export type IUserProfile = IUserProfileFollowers &
  IUserProfileAbout & {
    id: string;
    socialLinks: IUserSocialLink;
  };

export type IUserProfileFollower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type IUserProfileFriend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type IUserProfilePost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserCard = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPosts: number;
  role: string;
};

// ----------------------------------------------------------------------

export type IUserAccountGeneral = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
};

export type IUserAccountBillingCreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type IUserAccountBillingInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type IUserAccountBillingAddress = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

// ----------------------------------------------------------------------

export type IUserAccountNotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export enum RoleUser {
  ADM = 1,
  CONS = 2,
  PART = 3,
}

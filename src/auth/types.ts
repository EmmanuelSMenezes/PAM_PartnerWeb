// ----------------------------------------------------------------------

import { HubConnection } from '@microsoft/signalr';
import { Dispatch, SetStateAction } from 'react';
import { IGeoJSON, PropertiesActuationArea } from 'src/@types/area';

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type PartnerType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
};

export type JWTContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsInitialized: Dispatch<SetStateAction<boolean>>;
  user: AuthUserType;
  setUser: any;
  temporaryPassword: boolean;
  setTemporaryPassword: Dispatch<SetStateAction<boolean>>;
  token: string;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
  partnerId: PartnerType;
  setPartnerId: (value: any) => void;
  isInactiveCollaborator: any;
  setIsInactiveCollaborator: (value: any) => void;
  signalRUserConnection?: HubConnection;
  // signalRStyleConnection?: HubConnection;
};

export type GlobalContextType = {
  products: any;
  setProducts: (value: any) => void;
  isActiving: boolean;
  setIsActiving: (value: boolean) => void;
  branchList: any;
  setBranchList: (value: any) => void;
  coords: IGeoJSON<PropertiesActuationArea> | undefined;
  setCoords: (value: IGeoJSON<PropertiesActuationArea>) => void;
  branchData: any;
  setBranchData: (value: any) => void;
  partnerOrdersList: any;
  setPartnerOrdersList: (value: any) => void;
  currentOrder: any;
  setCurrentOrder: (value: any) => void;
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export type FirebaseContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type AWSCognitoContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type Auth0ContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  // login: () => Promise<void>;
  logout: () => void;
  // To avoid conflicts between types this is just a temporary declaration.
  // Remove below when you choose to authenticate with Auth0.
  login: (email?: string, password?: string) => Promise<void>;
  register?: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

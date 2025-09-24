/* eslint-disable eqeqeq */
import { createContext, useEffect, useCallback, useMemo, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { createSession } from 'src/service/session';
import { getPartnerById } from 'src/service/partner';
import { HOST_API_COMMUNICATION } from 'src/config-global';
import { useRouter } from 'next/router';
import { PATH_AUTH } from 'src/routes/paths';
import localStorageAvailable from '../utils/localStorageAvailable';
import { isValidToken, setSession } from './utils';
import { AuthUserType, JWTContextType } from './types';

const AuthContext = createContext<JWTContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [signalRUserConnection, setSignalRUserConnection] = useState<HubConnection | undefined>();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [temporaryPassword, setTemporaryPassword] = useState<boolean>(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({} as AuthUserType);
  const [partnerId, setPartnerId] = useState<any>({});
  const [isInactiveCollaborator, setIsInactiveCollaborator] = useState<boolean>(false);
  const { replace } = useRouter();

  const storageAvailable = localStorageAvailable();

  const createHubConnectionSignalR = async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_COMMUNICATION}core-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setSignalRUserConnection(newConnection);
  };

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  useEffect(() => {
    if (signalRUserConnection) {
      signalRUserConnection.on('DisconnectUser', (userId) => {
        console.info(`[WS - ON]: DisconnectUser.`);

        const userStorage: any = localStorage.getItem('@PAM:partner');
        const parseUser = JSON.parse(userStorage);

        console.log('userId', userId);
        console.log('parseUser', parseUser.user_id);

        if (userId == parseUser.user_id) {
          try {
            logout();
            replace(PATH_AUTH.login);
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  }, [signalRUserConnection]);

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      const userToken =
        storageAvailable && localStorage.getItem('@PAM:partner')
          ? localStorage.getItem('@PAM:partner')
          : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        setIsAuthenticated(true);
        setToken(accessToken);
        setUser(userToken !== null ? JSON.parse(userToken) : null);
        const storedPartnerId = localStorage.getItem('partnerId');

        if (storedPartnerId) {
          setPartnerId(JSON.parse(storedPartnerId) || null);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      setIsInitialized(false);
    } finally {
      setIsInitialized(true);
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await createSession(email, password);

    if (response.user.isCollaborator && response.user.isActiveCollaborator === false) {
      setIsInactiveCollaborator(true);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('@PAM:partner');
      localStorage.removeItem('partnerId');
      return false;
    }

    if (!response.user.isCollaborator && !response.user.active) {
      setIsInactiveCollaborator(true);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('@PAM:partner');
      localStorage.removeItem('partnerId');
      return false;
    }

    const userIsActived = response.user.isCollaborator
      ? response.user.isActiveCollaborator
      : response.user.active;

    if (userIsActived) {
      const id: any = response.user.isCollaborator
        ? response.user.sponsor_id
        : response?.user?.user_id;

      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('@PAM:partner', JSON.stringify(response.user));
      setToken(response.token);

      const responsePartnerId = await getPartnerById(id);

      if (!responsePartnerId) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('@PAM:partner');
        localStorage.removeItem('partnerId');
        setToken('');
        return false;
      }

      localStorage.setItem('partnerId', JSON.stringify(responsePartnerId));
      setPartnerId(responsePartnerId);

      setUser(response.user);
      setSession(response.token);

      if (response.user.password_generated === true) {
        return setTemporaryPassword(true);
      }

      setIsAuthenticated(true);
      setIsInitialized(true);
      setIsInactiveCollaborator(false);
    }

    return response;
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    setUser({});
    setIsAuthenticated(false);
    setTemporaryPassword(false);
    setIsInactiveCollaborator(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('@PAM:partner');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('GeneralStyle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized,
      isAuthenticated,
      user,
      token,
      setIsAuthenticated,
      setIsInitialized,
      temporaryPassword,
      setTemporaryPassword,
      partnerId,
      setPartnerId,
      setUser,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      logout,
      isInactiveCollaborator,
      setIsInactiveCollaborator,
      signalRUserConnection,
    }),
    [
      isAuthenticated,
      isInitialized,
      user,
      login,
      logout,
      setIsAuthenticated,
      setIsInitialized,
      partnerId,
      setUser,
      setPartnerId,
      temporaryPassword,
      setTemporaryPassword,
      token,
      isInactiveCollaborator,
      setIsInactiveCollaborator,
      signalRUserConnection,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };

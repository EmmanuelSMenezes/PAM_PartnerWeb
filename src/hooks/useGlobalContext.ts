import { useContext } from 'react';
import { GlobalContext } from '../context/globalContext';

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};

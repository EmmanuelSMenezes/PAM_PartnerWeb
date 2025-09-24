import { useContext } from 'react';
import { StatusContext } from '../context/statusContext';

export const useStatusContext = () => {
  const context = useContext(StatusContext);

  if (!context) throw new Error('useChatContext context must be use inside ChatProvider');

  return context;
};

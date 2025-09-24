import { createContext, useMemo, useState } from 'react';
import { IGeoJSON, PropertiesActuationArea } from 'src/@types/area';

import { GlobalContextType } from 'src/auth/types';

const GlobalContext = createContext<GlobalContextType | null>(null);

// ----------------------------------------------------------------------

type GlobalProviderProps = {
  children: React.ReactNode;
};

function GlobalProvider({ children }: GlobalProviderProps) {
  const [products, setProducts] = useState('');
  const [isActiving, setIsActiving] = useState(false);
  const [coords, setCoords] = useState<IGeoJSON<PropertiesActuationArea>>();
  const [branchList, setBranchList] = useState();
  const [branchData, setBranchData] = useState(null);
  const [partnerOrdersList, setPartnerOrdersList] = useState();
  const [currentOrder, setCurrentOrder] = useState();
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [activeTab, setActiveTab] = useState('general');

  const memoizedValue = useMemo(
    () => ({
      products,
      setProducts,
      isActiving,
      setIsActiving,
      branchList,
      setBranchList,
      coords,
      setCoords,
      branchData,
      setBranchData,
      partnerOrdersList,
      setPartnerOrdersList,
      currentOrder,
      setCurrentOrder,
      selectedBranch,
      setSelectedBranch,
      activeTab,
      setActiveTab,
    }),
    [
      products,
      isActiving,
      coords,
      branchList,
      setBranchList,
      branchData,
      setBranchData,
      partnerOrdersList,
      setPartnerOrdersList,
      currentOrder,
      setCurrentOrder,
      selectedBranch,
      setSelectedBranch,
      activeTab,
      setActiveTab,
    ]
  );

  return <GlobalContext.Provider value={memoizedValue}>{children}</GlobalContext.Provider>;
}

export { GlobalContext, GlobalProvider };

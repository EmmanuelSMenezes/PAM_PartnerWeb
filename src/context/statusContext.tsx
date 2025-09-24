import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { HOST_API_ORDER } from 'src/config-global';

interface IStatusContext {
  usersStatus?: IOrderStatus[];
  setUsersStatus?: (status: IOrderStatus[]) => void;
  signalROrderConnection?: HubConnection;
  setSignalROrderConnection: (connection: HubConnection) => void;
}

interface IOrderStatus {
  order_id: string;
  status: string;
}

const StatusContext = createContext<IStatusContext>({} as IStatusContext);

const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalROrderConnection, setSignalROrderConnection] = useState<HubConnection | undefined>();
  const [orderId, setOrderId] = useState();
  const [updatedBy, setUpdatedBy] = useState();
  const [orderStatusId, setOrderStatusId] = useState();
  const { user, token, partnerId } = useAuthContext();

  const createHubConnectionSignalR = useCallback(async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_ORDER}order-status-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setSignalROrderConnection(newConnection);
  }, []);

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  useEffect(() => {
    if (signalROrderConnection) {
      signalROrderConnection.on('OrderStatusChanged', ({ order_id, order_status_id }) => {
        console.info(`[WS - ON]: Status Received.`);
        console.info('signal', signalROrderConnection);
      });
    }
  }, [signalROrderConnection]);

  useEffect(() => {
    if (signalROrderConnection && user && token && partnerId?.partner_id) {
      console.info(`[WS - INVOKE]: RefreshStatus.`);
      signalROrderConnection.invoke('JoinCommunicationOrder', partnerId?.partner_id);
    }
  }, [signalROrderConnection]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    orderStatusId,
    updatedBy,
    orderId,
    setUpdatedBy,
    signalROrderConnection,
    setOrderStatusId,
    setSignalROrderConnection,
    setOrderId,
  };
  return <StatusContext.Provider value={contextValue}>{children}</StatusContext.Provider>;
};

export { StatusContext, StatusProvider };

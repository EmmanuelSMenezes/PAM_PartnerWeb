import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, useEffect, useState } from 'react';
import { IChat } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import { BadgeStatusValue } from 'src/components/badge-status';
import { HOST_API_COMMUNICATION } from 'src/config-global';

interface IChatContext {
  updateStatus: BadgeStatusValue;
  usersStatus: IStatus[];
  setUpdateStatus: (status: BadgeStatusValue) => void;
  setUsersStatus: (status: IStatus[]) => void;
  signalRChatConnection?: HubConnection;
  setSignalRChatConnection: (connection: HubConnection) => void;
  selectedChat: any;
  setSelectedChat: (value: any) => void;
  preSelectedChat?: string;
  setPreSelectedChat: (chatId?: string) => void;
}

interface IStatus {
  User_id: string;
  Status: BadgeStatusValue;
}

const ChatContext = createContext<IChatContext>({} as IChatContext);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalRChatConnection, setSignalRChatConnection] = useState<HubConnection | undefined>();
  const [updateStatus, setUpdateStatus] = useState<BadgeStatusValue>('invisível');
  const { user, token } = useAuthContext();
  const [usersStatus, setUsersStatus] = useState<IStatus[]>([] as IStatus[]);
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [preSelectedChat, setPreSelectedChat] = useState<string | undefined>();

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const createHubConnectionSignalR = async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_COMMUNICATION}chat-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setSignalRChatConnection(newConnection);
  };

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  useEffect(() => {
    if (signalRChatConnection && user && token) {
      signalRChatConnection.on('RefreshStatus', (statuses) => {
        console.info(`[WS - ON]: Status Received.`);

        JSON.parse(statuses).forEach((stats: IStatus) => {
          if (stats.User_id === user?.user_id || stats.User_id === user?.sponsor_id) {
            setUpdateStatus(stats.Status);
          }
        });
        setUsersStatus(JSON.parse(statuses));
      });
    }
  }, [signalRChatConnection]);

  useEffect(() => {
    if (signalRChatConnection && user && token) {
      console.info(`[WS - INVOKE]: RefreshStatus.`);
      signalRChatConnection.invoke('RefreshStatus', userId, updateStatus);
      signalRChatConnection.invoke('JoinCommunicationChannel', userId);
    }
  }, [signalRChatConnection, setUpdateStatus, updateStatus]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    updateStatus,
    setUpdateStatus,
    usersStatus,
    setUsersStatus,
    signalRChatConnection,
    setSignalRChatConnection,
    selectedChat,
    setSelectedChat,
    preSelectedChat,
    setPreSelectedChat,
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };

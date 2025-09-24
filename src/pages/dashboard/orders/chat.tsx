import { Icon } from '@iconify/react';
import { Card, Container, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { IChat } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useChatContext } from 'src/hooks/useChatContext';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import DashboardLayout from 'src/layouts/dashboard';
import { getConversations, updateChat, updateMessage } from 'src/redux/slices/chat';
import { PATH_DASHBOARD } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { useRouter } from 'next/router';
import {
  ChatHeaderCompose,
  ChatMessageInput,
  ChatMessageList,
  ChatNav,
} from '../../../sections/@dashboard/chatConsumer';

Chat.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function Chat() {
  const { themeStretch } = useSettingsContext();
  const { signalRChatConnection, preSelectedChat, setPreSelectedChat } = useChatContext();
  const { user, token } = useAuthContext();
  const [chats, setChats] = useState<IChat[]>([] as IChat[]);
  const [selectedChat, setSelectedChat] = useState<IChat | undefined>(undefined);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { currentOrder } = useGlobalContext();

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const membersSelectedChat = selectedChat?.membersProfile?.filter(
    (member: any) => member?.user_id !== userId
  );

  const getAllConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getConversations(userId);
      const filterChats = response?.filter((chat: any) => chat.order_id !== null);

      // testar com alguém do mobile
      const filteredSelectedChat = filterChats?.filter(
        (chat: any) => chat?.order_id === currentOrder?.order_id && chat?.closed_by === null
      )[0];
      setSelectedChat(filteredSelectedChat);

      if (selectedChat || preSelectedChat) {
        const newSelectedChat = filterChats.filter(
          (chat: IChat) =>
            chat.chat_id === selectedChat?.chat_id || chat.chat_id === preSelectedChat
        )[0];

        setSelectedChat(newSelectedChat);
      }

      if (router.asPath === '/dashboard/orders/chat/?previous') {
        setPreSelectedChat(undefined);
        setSelectedChat(undefined);
      }

      const orderedChat = filterChats?.sort((x: any, y: any) => {
        const dateX = new Date(x?.lastMessage?.created_at).getTime();
        const dateY = new Date(y?.lastMessage?.created_at).getTime();
        return dateY - dateX;
      });
      setChats(orderedChat);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (signalRChatConnection && user && token) {
      signalRChatConnection.on('RefreshChatList', async (chat) => {
        console.info(`[WS - ON]: Status Received.`);

        setChats((old) => (old ? [JSON.parse(chat), ...old] : JSON.parse(chat)));
      });
    }
  }, [signalRChatConnection]);

  useEffect(() => {
    getAllConversations();
  }, []);

  useEffect(() => {
    if (signalRChatConnection && chats?.length && signalRChatConnection.state === 'Connected') {
      chats?.forEach((chat) => {
        if (!chat.closed && !chat.closed_by) {
          signalRChatConnection.invoke('JoinChat', chat.chat_id);
        }
      });
    }
  }, [signalRChatConnection, chats]);

  useEffect(() => {
    if (
      signalRChatConnection &&
      chats?.length &&
      signalRChatConnection.state === 'Connected' &&
      selectedChat
    ) {
      if (
        selectedChat &&
        selectedChat?.unReadCountMessages &&
        selectedChat?.unReadCountMessages > 0
      ) {
        selectedChat.messages
          .filter((message: any) => !message?.read_at && message?.sender_id !== userId)
          .forEach((message: any) => {
            message.read_at = new Date(new Date());
            message.chat_id = selectedChat.chat_id;
            updateMessage(message);
          });
      }
    }
  }, [selectedChat]);

  const handleSendMessage = async (message?: string) => {
    try {
      signalRChatConnection?.invoke(
        'SendMessageToEspecificChat',
        selectedChat?.chat_id,
        userId,
        JSON.stringify({
          content: message,
          chat_id: selectedChat?.chat_id,
          read_at: null,
          created_at: new Date(),
          sender_id: userId,
          message_id: uuidv4(),
          messageTypeTag: 'TEXT',
        }),
        `Bearer ${token}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedChat && chats?.length) {
      const chatsExcludedCurrent = chats?.map((chat) =>
        chat?.chat_id !== selectedChat?.chat_id ? chat : null
      );
      const newChats = chatsExcludedCurrent.map((chat) => chat || selectedChat);

      setChats(newChats);
    }
  }, [selectedChat]);

  const handleEndChat = async () => {
    try {
      signalRChatConnection?.invoke('LeaveChat', selectedChat?.chat_id);
      await updateChat({
        chat_id: selectedChat?.chat_id,
        closed_by: user?.isCollaborator ? user?.sponsor_id : user?.user_id,
      });
      // setSelectedChat(undefined);
      // await getAllConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickSelectChat = (chat: IChat) => setSelectedChat(chat);
  const chatId = selectedChat?.chat_id;
  useEffect(() => {
    if (signalRChatConnection && signalRChatConnection.state === 'Connected') {
      signalRChatConnection.on('ReceiveMessage', (user_id, newMessage) => {
        console.info('[WS]: Received Message');
        const message: any = JSON.parse(newMessage);

        if (chatId === message.chat_id) {
          const chatMessage = chats.filter((chat) => chat.chat_id === message.chat_id)[0];
          const newChat = {
            ...chatMessage,
            messages: [
              ...chatMessage.messages,
              { ...message, messageType: message?.messageTypeTag },
            ],
            lastMessage: { ...message, messageType: message?.messageTypeTag },
          };
          setSelectedChat(newChat);
          setChats((oldChats) => [
            newChat,
            ...oldChats.filter((oldChat) => oldChat.chat_id !== newChat.chat_id),
          ]);
        } else {
          setChats((oldChats) => {
            const chatMessage = oldChats.filter((chat) => chat.chat_id === message.chat_id)[0];
            const newChat = {
              ...chatMessage,
              messages: [
                ...chatMessage.messages,
                { ...message, messageType: message?.messageTypeTag },
              ],
              lastMessage: { ...message, messageType: message?.messageTypeTag },
            };
            return [newChat, ...oldChats.filter((oldChat) => oldChat.chat_id !== newChat.chat_id)];
          });
        }
      });
      signalRChatConnection.on('RefreshChatList', async (chat) => {
        console.info(`[WS - ON]: Status Received.`);
        setChats((old) => [JSON.parse(chat), ...old]);
      });
    }
  }, [signalRChatConnection, selectedChat]);

  const MessageList = useCallback(
    () => <ChatMessageList chat={selectedChat} />,
    [selectedChat, chats]
  );

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Chat com Consumidor"
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          { name: 'Chat' },
        ]}
      />

      <Card sx={{ height: '72vh', display: 'flex' }}>
        <ChatNav
          chats={chats}
          activeChatId={selectedChat?.chat_id}
          onSelectChat={(chat: any) => handleClickSelectChat(chat)}
        />

        {selectedChat ? (
          <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>
            <ChatHeaderCompose
              members={membersSelectedChat}
              chat={selectedChat}
              handleEndChat={handleEndChat}
            />
            <Stack
              direction="row"
              flexGrow={1}
              sx={{
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                <MessageList />

                {!selectedChat.closed && !selectedChat.closed_by && (
                  <ChatMessageInput
                    conversationId={selectedChat.chat_id}
                    handleSendMessage={handleSendMessage}
                    disabled={!!selectedChat.closed}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            gap="35px"
          >
            {isLoading ? (
              <Icon icon="eos-icons:bubble-loading" width="50" height="50" />
            ) : (
              <>
                <Iconify icon="tabler:message-x" width={140} />
                Nenhum chat selecionado.
              </>
            )}
          </Stack>
        )}
      </Card>
    </Container>
  );
}

import { Icon } from '@iconify/react';
import { Card, Container, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { useChatContext } from 'src/hooks/useChatContext';
import uuidv4 from 'src/utils/uuidv4';
import { IChat } from '../../../@types/communication';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  createChat,
  getConversations,
  updateChat,
  updateMessage,
} from '../../../redux/slices/chat';
import { PATH_DASHBOARD } from '../../../routes/paths';
import ChatHeaderCompose from './header/ChatHeaderCompose';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';

export default function Chat() {
  const { themeStretch } = useSettingsContext();
  const { signalRChatConnection } = useChatContext();
  const { user, token, partnerId } = useAuthContext();
  const [chats, setChats] = useState<IChat[]>();
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const membersSelectedChat = selectedChat?.membersProfile?.filter(
    (member) => member.user_id !== userId
  );

  const getAllConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getConversations(userId);
      const filterChats = response?.filter(
        (chat: any) =>
          chat.order_id === null &&
          chat.members.includes(partnerId?.admin_id) &&
          chat.closed_by === null &&
          chat.closed === null
      )[0];

      const chatParams = {
        order_id: null,
        members: [partnerId?.admin_id, userId],
      };

      if (filterChats) {
        setSelectedChat(filterChats);
        setChats([filterChats]);
      } else {
        const chatResponse = await createChat(chatParams);
        setSelectedChat(chatResponse);
        setChats([chatResponse]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          .filter((message) => !message?.read_at && message?.sender_id !== userId)
          .forEach((message) => {
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

      // const dataNotification = {
      //   title: String(message),
      //   description: '',
      //   user_id: String(selectedChat?.members.filter((value: any) => value !== userId)[0]),
      //   type: 'INFO',
      //   created_at: new Date(),
      // };
      // await createNotification(dataNotification);
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
      await updateChat({ chat_id: selectedChat?.chat_id, closed_by: userId });
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
        const message = JSON.parse(newMessage);

        if (chatId === message.chat_id && chats !== undefined) {
          const chatMessage = chats.filter((chat: any) => chat.chat_id === message.chat_id)[0];
          const newChat = {
            ...chatMessage,
            messages: [
              ...chatMessage.messages,
              { ...message, messageType: message?.messageTypeTag },
            ],
            lastMessage: { ...message, messageType: message?.messageTypeTag },
          };
          setSelectedChat(newChat);
          setChats((oldChats: any) => [
            newChat,
            ...oldChats.filter((oldChat: any) => oldChat.chat_id !== newChat.chat_id),
          ]);
        } else {
          setChats((oldChats: any) => {
            const chatMessage = oldChats.filter((chat: any) => chat.chat_id === message.chat_id)[0];
            const newChat = {
              ...chatMessage,
              messages: [
                ...chatMessage.messages,
                { ...message, messageType: message?.messageTypeTag },
              ],
              lastMessage: { ...message, messageType: message?.messageTypeTag },
            };
            return [
              newChat,
              ...oldChats.filter((oldChat: any) => oldChat.chat_id !== newChat.chat_id),
            ];
          });
        }
      });
      signalRChatConnection.on('RefreshChatList', async (chat) => {
        console.info(`[WS - ON]: Status Received.`);
        setChats((old: any) => [JSON.parse(chat), ...old]);
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
        heading="Chat"
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          { name: 'Chat' },
        ]}
      />

      <Card sx={{ height: '72vh', display: 'flex' }}>
        {/* <ChatNav
          chats={chats}
          activeChatId={selectedChat?.chat_id}
          onSelectChat={(chat: any) => setSelectedChat(chat)}
        /> */}

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
            <Icon icon="eos-icons:bubble-loading" width="50" height="50" />
          </div>
        ) : (
          <>
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
                <Iconify icon="tabler:message-x" width={140} />
                Nenhum Chat Selecionado.
              </Stack>
            )}
          </>
        )}
      </Card>
    </Container>
  );
}

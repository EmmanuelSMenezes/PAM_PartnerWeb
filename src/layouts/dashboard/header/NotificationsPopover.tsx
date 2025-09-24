/* eslint-disable consistent-return */
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { INotification } from 'src/@types/communication';
import { useRouter } from 'next/router';
import { useChatContext } from 'src/hooks/useChatContext';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { isUuid } from 'uuidv4';
import { apiCommunication } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/useAuthContext';
import { markAsReadNotification } from 'src/service/communication';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import Scrollbar from '../../../components/scrollbar';
import { fToNow } from '../../../utils/date';

interface NotificationPopoverProps {
  notifications: INotification[];
  handleMarkAllAsRead: () => void;
  updateNotifications: (newNotifications: INotification[]) => void;
}

export default function NotificationsPopover({
  notifications,
  handleMarkAllAsRead,
  updateNotifications,
}: NotificationPopoverProps) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [viewAllNotifications, setViewAllNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalUnRead = notifications.filter((notification) => !notification?.read_at).length;

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setIsLoading(false);
    setOpenPopover(null);
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

  const handleMarkAsReadNotification = async (notification: INotification) => {
    if (notification?.type === 'chat_message' && isUuid(notification?.aux_content || '')) {
      const selectedNotificationsMarkAsRead = notifications.filter(
        (otherNotification) =>
          otherNotification?.aux_content === notification?.aux_content &&
          otherNotification?.read_at === null
      );
      selectedNotificationsMarkAsRead.forEach(async (selectedNotification) => {
        await markAsReadNotification(selectedNotification?.notification_id);
      });

      const newNotifications = notifications.map((n) => {
        if (
          selectedNotificationsMarkAsRead
            .map((v) => v?.notification_id)
            .includes(n?.notification_id)
        ) {
          return { ...n, read_at: new Date() };
        }
        return n;
      });

      updateNotifications(newNotifications);
    }
  };

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 360, p: 0, overflow: 'auto' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificações</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Você tem {totalUnRead} mensagens não lidas.
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Marcar todas como lida.">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2,
                px: 2.5,
              }}
            >
              <Iconify sx={{ width: '40px', height: '40px' }} icon="eos-icons:bubble-loading" />
            </Box>
          ) : (
            <>
              {viewAllNotifications ? (
                <>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification?.notification_id}
                      notification={notification}
                      handleClosePopover={handleClosePopover}
                      handleMarkAsReadNotification={handleMarkAsReadNotification}
                      handleLoading={handleLoading}
                    />
                  ))}
                </>
              ) : (
                <>
                  <List
                    disablePadding
                    subheader={
                      <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                        NOVAS
                      </ListSubheader>
                    }
                  >
                    {notifications.slice(0, 3).map((notification) => (
                      <NotificationItem
                        key={notification?.notification_id}
                        notification={notification}
                        handleClosePopover={handleClosePopover}
                        handleMarkAsReadNotification={handleMarkAsReadNotification}
                        handleLoading={handleLoading}
                      />
                    ))}
                  </List>

                  <List
                    disablePadding
                    subheader={
                      <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                        ANTERIORES
                      </ListSubheader>
                    }
                  >
                    {notifications.slice(3, 7).map((notification) => (
                      <NotificationItem
                        key={notification?.notification_id}
                        notification={notification}
                        handleClosePopover={handleClosePopover}
                        handleMarkAsReadNotification={handleMarkAsReadNotification}
                        handleLoading={handleLoading}
                      />
                    ))}
                  </List>
                </>
              )}
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  disableRipple
                  onClick={() => setViewAllNotifications(!viewAllNotifications)}
                >
                  {!viewAllNotifications ? 'Visualizar todas' : 'Visualizar menos'}
                </Button>
              </Box>
            </>
          )}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

function NotificationItem({
  notification,
  handleClosePopover,
  handleMarkAsReadNotification,
  handleLoading,
}: {
  notification: INotification;
  handleClosePopover: () => void;
  handleMarkAsReadNotification: (notification: INotification) => void;
  handleLoading: () => void;
}) {
  const { avatar, title } = renderContent(notification);
  const { setPreSelectedChat } = useChatContext();
  const { replace } = useRouter();
  const { partnerId } = useAuthContext();

  // const [isChatAdmin, setIsChatAdmin] = useState<boolean>(false);

  const chatList = async (data: INotification): Promise<any> => {
    handleLoading();
    try {
      const response = await apiCommunication.get('/chat/list', {
        params: { member_id: data.user_id },
      });

      const chats = response.data.data;

      const chatWhthAdmin = chats.map(
        (chat: any) =>
          chat.chat_id === data.aux_content && chat.members.includes(partnerId?.admin_id)
      );

      if (chatWhthAdmin.includes(true)) {
        replace(PATH_DASHBOARD.chat.root);
      } else {
        replace(PATH_DASHBOARD.chatConsumer.root);
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleClosePopover();
    }
  };

  const handleClickNotificationAction = async () => {
    if (notification?.type === 'chat_message' && isUuid(notification?.aux_content || '')) {
      setPreSelectedChat(notification?.aux_content);
      await handleMarkAsReadNotification(notification);
      chatList(notification);
    }
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification?.read_at && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={handleClickNotificationAction}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.created_at)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: INotification) {
  const title = (
    <>
      <Typography variant="subtitle2">{notification?.title}</Typography>
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        {notification?.description}
      </Typography>
    </>
  );

  if (notification?.type === 'order_placed') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification?.type === 'order_shipped') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (notification?.type === 'mail') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (notification?.type === 'chat_message') {
    return {
      avatar: <img alt={notification?.title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: (
      <img alt={notification?.title} src="/assets/icons/notification/ic_info.png" width={28} />
    ),
    title,
  };
}

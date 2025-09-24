import { Box, Drawer, IconButton, IconButtonProps, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useChatContext } from 'src/hooks/useChatContext';
import { IChat } from '../../../../@types/communication';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import useResponsive from '../../../../hooks/useResponsive';
import ChatNavAccount from './ChatNavAccount';
import ChatNavList from './ChatNavList';
import ChatNavSearch from './ChatNavSearch';
import ChatNavSearchResults from './ChatNavSearchResults';

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  chats?: IChat[];
  activeChatId?: string;
  onSelectChat: (chat: any) => void;
};

export default function ChatNav({ chats, activeChatId, onSelectChat }: Props) {
  const [openNav, setOpenNav] = useState(false);
  const { setSelectedChat, selectedChat } = useChatContext();
  const [searchContacts, setSearchContacts] = useState('');
  const [searchResults, setSearchResults] = useState<any>();

  const theme = useTheme();

  // const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const isDesktop = useResponsive('up', 'md');
  const isCollapse = isDesktop && !openNav;

  useEffect(() => {
    if (!isDesktop) {
      handleCloseNav();
    } else {
      handleOpenNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const handleToggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  const handleChangeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = event.target;

      setSearchContacts(value);

      if (value) {
        // const response = await apiCommunication.get('/chat/list', {
        //   params: { member_id: userId },
        // });
        // console.log(chats);
        const filtro = chats?.filter(
          (chat: IChat) => chat?.description?.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );

        setSearchResults(filtro);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = (
    <>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <ChatNavAccount />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <IconButton onClick={handleToggleNav}>
            <Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
          </IconButton>
        </Stack>

        {!isCollapse && (
          <ChatNavSearch
            value={searchContacts}
            onChange={handleChangeSearch}
            onClickAway={() => setSearchContacts('')}
          />
        )}
      </Box>

      <Scrollbar>
        {!searchContacts ? (
          <ChatNavList
            openNav={openNav}
            onCloseNav={handleCloseNav}
            chats={chats}
            selected={(conversationId: string) => activeChatId === conversationId}
            onSelectChat={onSelectChat}
          />
        ) : (
          <ChatNavSearchResults
            searchContacts={searchContacts}
            searchResults={searchResults}
            onSelectContact={(chat: any) => setSelectedChat(chat)}
          />
        )}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <StyledToggleButton onClick={handleToggleNav}>
          <Iconify width={16} icon="eva:people-fill" />
        </StyledToggleButton>
      )}

      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              pb: 1,
              width: 1,
              position: 'static',
              ...(isCollapse && {
                transform: 'none !important',
                visibility: 'visible !important',
              }),
            },
          }}
          sx={{
            width: NAV_WIDTH,
            transition: theme.transitions.create('width'),
            ...(isCollapse && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pb: 1,
              width: NAV_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

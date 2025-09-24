import { Stack, StackProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IChat, Member } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import { CustomAvatar, CustomAvatarGroup } from 'src/components/custom-avatar';
import { useChatContext } from 'src/hooks/useChatContext';

interface Props extends StackProps {
  members?: Member[];
  chat?: IChat;
  handleEndChat: () => void;
}

export default function ChatHeaderCompose({ chat, members, sx, handleEndChat, ...other }: Props) {
  const { user } = useAuthContext();
  const { usersStatus } = useChatContext();
  const [statusMember, setStatusMember] = useState('');

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const selectedMember = members?.filter((member) => member?.user_id !== userId);
  useEffect(() => {
    if (selectedMember && selectedMember.length === 1) {
      setStatusMember(
        usersStatus?.filter((stat) => stat.User_id === selectedMember[0]?.user_id)[0]?.Status
      );
    }
  }, [usersStatus, selectedMember]);

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 2,
        px: 2.5,
        ...sx,
      }}
      {...other}
    >
      {members?.length && selectedMember?.length && (
        <Stack direction="row" alignItems="center">
          {selectedMember.length > 1 ? (
            <CustomAvatarGroup compact sx={{ width: 48, height: 48 }}>
              {selectedMember.slice(0, 2).map((participant: Member) => (
                <CustomAvatar
                  key={participant?.user_id}
                  alt={participant?.name}
                  src={participant?.avatar}
                />
              ))}
            </CustomAvatarGroup>
          ) : (
            <CustomAvatar
              src={selectedMember[0]?.avatar}
              alt={selectedMember?.map((participant: Member) => participant?.name).join(', ')}
              name={selectedMember?.map((participant: Member) => participant?.name).join(', ')}
              // BadgeProps={{
              //   badgeContent: <BadgeStatus status={statusMember || 'offline'} />,
              // }}
              sx={{ cursor: 'pointer', width: 40, height: 40 }}
            />
          )}

          <Typography variant="subtitle2" sx={{ color: 'text.secondary', marginLeft: '10px' }}>
            {chat?.description ||
              selectedMember?.map((participant: Member) => participant?.name).join(', ')}
          </Typography>
        </Stack>
      )}
      {/* <Stack>
        <Iconify icon="mi:options-horizontal" width={28} onClick={handleOpenPopover} />
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="top-right"
          sx={{ p: 0 }}
        >
          <List sx={{ px: 1 }}>
            <MenuItem
              onClick={handleEndChat}
              sx={{ color: 'red' }}
              disabled={!!(chat?.closed && chat?.closed_by)}
            >
              <Iconify icon="zondicons:close-outline" width={28} color="red" />
              Encerrar Chat
            </MenuItem>
          </List>
        </MenuPopover>
      </Stack> */}
    </Stack>
  );
}

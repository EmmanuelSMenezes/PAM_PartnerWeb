import { IconButton, Link, Stack, Typography } from '@mui/material';
import { Member } from 'src/@types/communication';
import { useAuthContext } from 'src/auth/useAuthContext';
import BadgeStatus from 'src/components/badge-status';
import { CustomAvatar, CustomAvatarGroup } from 'src/components/custom-avatar';
import Iconify from 'src/components/iconify';

type Props = {
  members?: Member[];
};

export default function ChatHeaderDetail({ members }: Props) {
  const { user } = useAuthContext();
  const isGroup = false;
  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const participantInfo = members?.filter((member) => member.user_id !== userId)[0];

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 1, 2, 2),
      }}
    >
      {isGroup ? (
        <Stack flexGrow={1}>
          <CustomAvatarGroup max={3}>
            {members?.map((participant) => (
              <CustomAvatar
                key={participant.user_id}
                alt={participant.name}
                src={participant.avatar}
              />
            ))}
          </CustomAvatarGroup>

          <Link
            variant="body2"
            sx={{
              mt: 0.5,
              alignItems: 'center',
              display: 'inline-flex',
              color: 'text.secondary',
            }}
          >
            {members?.length} persons
            <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
          </Link>
        </Stack>
      ) : (
        <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
          <CustomAvatar
            src={participantInfo?.avatar}
            alt={participantInfo?.name}
            // BadgeProps={{
            //   badgeContent: <BadgeStatus status="online" />,
            // }}
          />

          <div>
            <Typography variant="subtitle2">{participantInfo?.name}</Typography>

            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {participantInfo?.status === 'offline' ? (
                participantInfo?.lastActivity && fToNow(participantInfo?.lastActivity)
              ) : (
                <Box component="span" sx={{ textTransform: 'capitalize' }}>
                  {participantInfo?.status}
                </Box>
              )}
            </Typography> */}
          </div>
        </Stack>
      )}

      <IconButton>
        <Iconify icon="eva:phone-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:video-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );
}

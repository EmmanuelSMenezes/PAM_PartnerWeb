import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  TableRow,
  TableCell,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Checkbox,
  Stack,
  Typography,
} from '@mui/material';
import ConfirmDialog from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify';
import { maskCpfCnpj } from 'src/utils/formatNumber';
import MenuPopover from '../../../../components/menu-popover';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
  onDisableRow: () => void;
  onDeleteRow: VoidFunction;
  disableUser?: VoidFunction;

  branchList?: any;
};

export default function CollabTableRow({
  row,
  selected,
  onSelectRow,
  onDisableRow,
  branchList,
  onDeleteRow,
  disableUser,
}: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDisableConfirm, setOpenDisabledConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setOpenDisabledConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenDisableConfirm = () => {
    setOpenDisabledConfirm(true);
  };

  const handleCloseDisableConfirm = () => {
    setOpenConfirm(false);
    setOpenDisabledConfirm(false);
  };

  const conditionalMessageAlert = (status: boolean) => {
    if (status) {
      return 'Tem certeza que deseja suspender o colaborador?';
    }
    return 'Tem certeza que deseja ativar o colaborador?';
  };

  return (
    <>
      <TableRow
        // hover
        // selected={selected}
        sx={{
          borderBottom: '1px solid #C4C4C4',
        }}
        role="checkbox"
        aria-checked={selected}
        // tabIndex={-1}
        key={row?.id}
      >
        <TableCell align="left" sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <Checkbox
            checked={selected}
            onClick={(e: any) => {
              onSelectRow();
            }}
          />
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row?.fullname}
          </Typography>
        </TableCell>
        <TableCell
          align="center"
          sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
          // onClick={() => push(PATH_DASHBOARD.collab.edit)}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {maskCpfCnpj(row?.profile.document)}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row?.email}
          </Typography>
        </TableCell>
        <TableCell
          align="center"
          sx={{
            whiteSpace: 'nowrap',
            color: row?.active ? '#008000' : '#CC0000',
            fontWeight: 'bold',
          }}
        >
          {row?.active ? 'Ativo' : 'Suspenso'}
        </TableCell>
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          <MenuPopover
            open={openPopover}
            onClose={handleClosePopover}
            arrow="right-top"
            sx={{ width: 160 }}
          >
            <MenuItem
              onClick={() => {
                handleOpenDisableConfirm();
                handleClosePopover();
              }}
            >
              {row?.active ? (
                <Stack direction="row" sx={{ color: '#FF6400' }}>
                  <Icon icon="uil:setting" width="30" height="30" />
                  Suspender
                </Stack>
              ) : (
                <Stack direction="row" sx={{ color: '#008000' }}>
                  <Icon icon="ic:baseline-check" width="30" height="30" color="#008000" />
                  Ativar
                </Stack>
              )}
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: '#CC0000' }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Excluir
            </MenuItem>
          </MenuPopover>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openDisableConfirm}
        onClose={handleCloseDisableConfirm}
        title="Atenção"
        content={conditionalMessageAlert(row?.active)}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDisableRow();
              handleCloseDisableConfirm();
            }}
          >
            {row?.active ? 'Suspender' : 'Ativar'}
          </Button>
        }
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir o colaborador?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              handleCloseConfirm();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}

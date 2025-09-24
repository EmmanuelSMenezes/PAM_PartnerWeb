import { useState } from 'react';
import {
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import ConfirmDialog from 'src/components/confirm-dialog';
import { IGetBranch } from 'src/@types/user';
import { maskZipCode } from 'src/utils/formatNumber';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';

type Props = {
  row: IGetBranch;
  selected: boolean;
  // onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function BranchsTableRow({
  row,
  selected,
  // onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          borderBottom: '1px solid #C4C4C4',
        }}
      >
        {/* <TableCell padding="checkbox" align="center">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" noWrap>
            {row?.branch_name}
          </Typography>
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" noWrap>
            {maskZipCode(row?.address?.zip_code)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap>
            {row?.address?.street}, {row?.address?.number}
          </Typography>
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" noWrap>
            {row?.address?.city}/{row?.address?.state}
          </Typography>
        </TableCell>

        <TableCell align="center">
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
                onEditRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:edit-fill" />
              Editar
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Excluir
            </MenuItem>
          </MenuPopover>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir esta filial?"
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

import { Checkbox, Typography, Stack, StackProps, Button } from '@mui/material';
import { useState } from 'react';
import Iconify from '../iconify';
import ConfirmDialog from '../confirm-dialog';

interface Props extends StackProps {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected?: number;
  onDisableRow?: VoidFunction | any;
  onDeleteRow?: VoidFunction | any;
  onSelectAllRows: (checked: boolean) => void;
}

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  onDeleteRow,
  onDisableRow,
  onSelectAllRows,
  sx,
  ...other
}: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDisabledConfirm, setOpenDisabledConfirm] = useState(false);

  if (!numSelected) {
    return null;
  }

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setOpenDisabledConfirm(false);
  };

  const handleDisableOpenConfirm = () => {
    setOpenDisabledConfirm(true);
  };

  const handleCloseDisableConfirm = () => {
    setOpenDisabledConfirm(false);
    setOpenConfirm(false);
  };

  // const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
  //   setOpenPopover(event.currentTarget);
  // };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 58,
        position: 'absolute',
        bgcolor: '#d4d4d4',
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
      />

      <Typography
        variant="subtitle1"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: '#005774',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} selecionados
      </Typography>
      <Iconify
        icon="fe:disabled"
        onClick={() => {
          handleDisableOpenConfirm();
          handleClosePopover();
        }}
        style={{ cursor: 'pointer', marginRight: '10px' }}
      />

      <Iconify
        icon="eva:trash-2-outline"
        onClick={() => {
          handleOpenConfirm();
          handleClosePopover();
        }}
        style={{ cursor: 'pointer' }}
      />
      {action && action}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir o(s) colaborador(es)?"
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
      <ConfirmDialog
        open={openDisabledConfirm}
        onClose={handleCloseDisableConfirm}
        title="Atenção"
        content="Tem certeza que deseja suspender o(s) colaborador(es)?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDisableRow();
              handleCloseDisableConfirm();
            }}
          >
            Suspender
          </Button>
        }
      />
    </Stack>
  );
}

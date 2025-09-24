import { useState } from 'react';
import { TableRow, TableCell, Typography, Checkbox, Button } from '@mui/material';
import ConfirmDialog from 'src/components/confirm-dialog';
import { IInvoice } from '../../../../../@types/invoice';

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function OccupationAreaTable({ row, selected, onSelectRow }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);

  // const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
  //   setOpenPopover(event.currentTarget);
  // };

  // const handleClosePopover = () => {
  //   setOpenPopover(null);
  // };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          borderBottom: '1px solid #C4C4C4',
        }}
      >
        <TableCell padding="checkbox" align="center">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" noWrap>
            {row?.nome}
          </Typography>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir este ponto?"
        action={
          <Button variant="contained" color="error">
            Excluir
          </Button>
        }
      />
    </>
  );
}

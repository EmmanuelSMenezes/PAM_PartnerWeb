import { useState, useEffect } from 'react';
import { TableRow, TableCell, Typography, Checkbox, Button } from '@mui/material';
import ConfirmDialog from 'src/components/confirm-dialog';
import { IGetBranch } from 'src/@types/user';
import { useGlobalContext } from 'src/hooks/useGlobalContext';

type Props = {
  row: IGetBranch;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow?: VoidFunction;
};

export default function PointsTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const { branchData, setBranchData } = useGlobalContext();

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    setBranchData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Checkbox
            checked={selected}
            onClick={(e: any) => {
              onSelectRow();
              setBranchData(e?.target?.checked ? row : null);
            }}
            disabled={!!(!selected && branchData)}
          />
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" noWrap>
            {row?.branch_name}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap>
            {row?.address?.street}, {row?.address?.number}
          </Typography>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir este ponto?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Excluir
          </Button>
        }
      />
    </>
  );
}

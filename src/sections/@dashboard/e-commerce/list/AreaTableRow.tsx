import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  TableRow,
  TableCell,
  Switch,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Typography,
} from '@mui/material';
import ConfirmDialog from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify';
import { updateArea } from 'src/service/area';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'notistack';
import MenuPopover from '../../../../components/menu-popover';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onDeleteRow?: VoidFunction;
  branchList?: any;
  areaList: () => void;
};

export default function AreaTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  branchList,
  areaList,
  onDeleteRow,
}: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { partnerId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

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

  const handleSwitchChange = async (areaData: any) => {
    if (areaData) {
      areaData.features[0].properties = {
        partner_id: partnerId?.partner_id,
        branch_id: areaData?.features[0].properties.branch_id,
        actuation_area_id: row?.features[0].properties.actuation_area_id,
        active: !areaData.features[0].properties.active,
        name: areaData?.features[0].properties.name,
      };
    }

    try {
      await updateArea(areaData);
      await areaList();

      enqueueSnackbar(
        !areaData?.features[0].properties.active
          ? 'Área de atuação desativada com sucesso'
          : 'Área de atuação ativada com sucesso'
      );
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        areaData?.features[0].properties.active
          ? 'Não foi possível desativar área de atuação'
          : 'Não foi possível ativar área de atuação',
        { variant: 'error' }
      );
    }
  };

  return (
    <>
      <TableRow
        // hover
        // onClick={() => onSelectRow()}
        role="checkbox"
        sx={{
          borderBottom: '1px solid #C4C4C4',
        }}
        aria-checked={selected}
        tabIndex={-1}
        key={row.id}
        selected={selected}
      >
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.features[0].properties.name}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {
              branchList?.filter(
                (value: any) => value.branch_id === row.features[0].properties.branch_id
              )[0]?.branch_name
            }
          </Typography>
        </TableCell>

        <TableCell align="center" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          <div>
            <Switch
              checked={row?.features[0].properties.active}
              onChange={() => handleSwitchChange(row)}
              color="primary"
              name="checked"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
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
              <Icon icon="uil:setting" width="30" height="30" />
              Configurar
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
      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      /> */}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Atenção"
        content="Tem certeza que deseja excluir esta área de atuação?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Excluir
          </Button>
        }
      />
    </>
  );
}

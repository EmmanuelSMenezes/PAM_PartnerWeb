import { useState } from 'react';
import {
  TableRow,
  TableCell,
  Switch,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Typography,
  Tooltip,
  styled,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ConfirmDialog from 'src/components/confirm-dialog';
import MenuPopover from 'src/components/menu-popover';
import { paramCase } from 'change-case';
import { useRouter } from 'next/router';
import { formatValue } from 'src/utils/formatNumber';
import { getProductUpdate } from 'src/service/product';
import { useSnackbar } from 'notistack';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { Icon } from '@iconify/react';
import { IProduct } from 'src/@types/product';
import Image from 'next/image';

type Props = {
  row: IProduct;
  selectedId?: string;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: VoidFunction;
  onEditRow: VoidFunction;
  getProductPartnerList: () => void;
};

export default function ItemTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  selectedId,
  getProductPartnerList,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { setIsActiving } = useGlobalContext();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { push } = useRouter();

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleSwitchChange = async (productData: any) => {
    const data = {
      product_id: productData?.product_id,
      name: productData.name,
      description: productData?.description,
      images: productData?.images,
      price: productData?.price,
      active: !productData?.active,
      updated_by: productData?.user_id,
      sale_price: productData?.sale_price,
    };

    if ((data.images.length === 0 && data.active) || (data.price === 0 && data.active)) {
      setIsActiving(true);
      handleEditRow(data.product_id);
    } else {
      try {
        await getProductUpdate(data);
        await getProductPartnerList();
      } catch (error) {
        console.error(error);
        enqueueSnackbar(
          productData?.active
            ? 'Não foi possível desabilitar o produto/serviço.'
            : 'Não foi possível habilitar o produto/serviço.'
        );
      }
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#FFF',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(13),
      border: '1px solid #dadde9',
    },
  }));

  const handleEditRow = (id: any) => {
    push(PATH_DASHBOARD.catalog.edit(paramCase(id)));
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          borderBottom: '1px solid #C4C4C4',
        }}
      >
        <TableCell
          align="center"
          sx={{
            maxWidth: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {row?.images[0]?.url ? (
              <Image
                src={row?.images[0]?.url}
                alt={row?.name}
                width={100}
                height={100}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '5px',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50px',
                  width: '50px',
                  border: '1px solid #C4C4C4',
                  background: '#E4e4e4',
                  borderRadius: '4px',
                }}
              >
                <Iconify
                  icon="material-symbols:image-not-supported-outline-rounded"
                  width={18}
                  color="#9A9A9A"
                />
              </div>
            )}

            <Typography
              noWrap
              variant="subtitle2"
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row?.reviewer ? (
                <HtmlTooltip
                  title={
                    <>
                      <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#ff0000' }}>
                        Revisão de preço
                      </Typography>
                      As taxas de serviço foram atualizadas, revise o valor do produto.
                    </>
                  }
                >
                  <Button sx={{ gap: 1, cursor: 'default' }}>
                    <Icon icon="zondicons:exclamation-solid" color="red" width="20" height="20" />{' '}
                    <p style={{ color: '#ff0000' }}> {row?.name}</p>
                  </Button>
                </HtmlTooltip>
              ) : (
                row?.name
              )}
            </Typography>
          </div>
        </TableCell>

        <Typography
          noWrap
          variant="subtitle2"
          sx={{
            mt: 3,
            maxWidth: '100%',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          R${formatValue(row?.sale_price)}
        </Typography>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <div>
            <Switch
              checked={row?.active}
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
              <Iconify icon="eva:edit-fill" onClick={() => handleEditRow(selectedId)} />
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
        content="Tem certeza que deseja desvincular este produto?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Excluir
          </Button>
        }
      />
    </>
  );
}

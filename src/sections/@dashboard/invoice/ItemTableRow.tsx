// @mui
import { Stack, TableRow, TableCell, Typography } from '@mui/material';
import { IInvoice } from 'src/@types/invoice';
import { CustomAvatar } from 'src/components/custom-avatar';
// utils

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const { invoiceTo } = row;

  // const [openConfirm, setOpenConfirm] = useState(false);

  // const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  //   const handleOpenConfirm = () => {
  //     setOpenConfirm(true);
  //   };

  //   const handleCloseConfirm = () => {
  //     setOpenConfirm(false);
  //   };

  //   const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
  //     setOpenPopover(event.currentTarget);
  //   };

  //   const handleClosePopover = () => {
  //     setOpenPopover(null);
  //   };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={invoiceTo?.name} />

            <Typography variant="subtitle2" noWrap alignItems="center">
              {invoiceTo?.name}
            </Typography>

            {/* <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {`INV-${invoiceNumber}`}
              </Link> */}
          </Stack>
        </TableCell>

        <TableCell align="left">Data</TableCell>

        <TableCell align="left">Data</TableCell>

        <TableCell align="center">Preço</TableCell>
        {/* 
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {sent}
        </TableCell> */}

        {/* <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === 'paid' && 'success') ||
              (status === 'unpaid' && 'warning') ||
              (status === 'overdue' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell> */}

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
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
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

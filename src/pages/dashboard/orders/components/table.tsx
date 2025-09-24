import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { paramCase } from 'change-case';
import { useRouter } from 'next/router';
import React from 'react';
import Scrollbar from 'src/components/scrollbar';
import { TableNoData, TablePaginationCustom, useTable } from 'src/components/table';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { hexToRgb } from 'src/utils/hexToRgb';

const TABLE_HEAD = [
  { id: 'orderId', label: 'ID Pedido', align: 'center', width: '15%' },
  { id: 'date', label: 'Data', align: 'center', width: '15%' },
  { id: 'clienteId', label: 'Cliente', align: 'center', width: '20%' },
  { id: 'point', label: 'Filial', align: 'center', width: '30%' },
  { id: 'status', label: 'Status', align: 'center', width: '20%' },
];

type Props = {
  ordersList: any;
  onRowsPerPageChange: any;
  totalRows: any;
  currentPage: any;
  rowsPerPage: any;
  loading: boolean;
};

function TableList({
  ordersList,
  totalRows,
  currentPage,
  loading,
  onRowsPerPageChange,
  rowsPerPage,
}: Props) {
  const { page, setPage } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const theme = useTheme();
  const { push } = useRouter();

  function getStatusColor(status: any) {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Em andamento':
        return 'info';
      case 'Concluído':
        return 'success';
      case 'Cancelado pelo cliente':
        return 'error';
      case 'Recusado':
        return 'error';
      default:
        return 'default';
    }
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              {TABLE_HEAD.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{
                    backgroundColor: `rgba(${hexToRgb(theme.palette.primary.main)[0]}, ${
                      hexToRgb(theme.palette.primary.main)[1]
                    }, ${hexToRgb(theme.palette.primary.main)[2]}, 0.1)`,
                    color: theme.palette.grey[900],
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // cursor: 'pointer',
                      gap: '5px',
                    }}
                  >
                    {headCell.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersList?.length === 0 && !loading && <TableNoData isNotFound />}

            {loading && !ordersList && (
              <>
                {[...Array(4)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(4)].map((__, cellIndex) => (
                      <TableCell key={cellIndex} colSpan={1} align="center">
                        <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
                      </TableCell>
                    ))}
                    <TableCell colSpan={4} align="center">
                      <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 1 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {ordersList?.map((order: any) => (
              <TableRow
                key={order.order_id}
                onClick={() => push(PATH_DASHBOARD.orders.details(paramCase(order.order_id)))}
                sx={{ cursor: 'pointer' }}
                hover
              >
                <TableCell align="center">
                  <Typography variant="subtitle2" noWrap>
                    {order?.order_number}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" noWrap>
                    {new Date(order?.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" noWrap>
                    {order?.consumer?.legal_name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" noWrap>
                    {order?.partner?.branch_name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={order.status_name}
                    color={getStatusColor(order.status_name)}
                    sx={{
                      borderRadius: '6px',
                      backgroundColor:
                        // eslint-disable-next-line no-nested-ternary
                        order.status_name === 'Recusado'
                          ? '#cc0000'
                          : // eslint-disable-next-line no-nested-ternary
                          '' || order.status_name === 'Aceito'
                          ? '#d4d4d4'
                          : '' || order.status_name === 'Aguardando pagamento'
                          ? '#F5DEB3'
                          : '',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        labelRowsPerPage="Itens por Página"
        count={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, value) => {
          setPage(value);
          currentPage(value);
        }}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
}

export default TableList;

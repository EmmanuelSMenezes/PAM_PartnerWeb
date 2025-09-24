import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import React from 'react';
import Scrollbar from 'src/components/scrollbar';
import { hexToRgb } from 'src/utils/hexToRgb';

export interface IOrderDetails {
  product_id: string;
  product_name: string;
  quantity: number;
  product_value: number;
}

const TABLE_HEAD = [
  { id: 'itemName', label: 'Item', align: 'left' },
  { id: 'amount', label: 'Quantidade', align: 'center' },
  { id: 'price', label: 'Preço Unitário', align: 'center' },
  { id: '', label: '' },
];

type Props = {
  currentOrder: any;
};

function TableDetails({ currentOrder }: Props) {
  const theme = useTheme();

  const serviceFee = currentOrder?.service_fee;
  const cardFee = currentOrder?.card_fee;
  const totalFee = (serviceFee + cardFee).toFixed(2);

  const valueOrder = currentOrder?.order_itens.map(
    (item: IOrderDetails) => item.product_value * item.quantity
  );

  const subtotal = valueOrder?.reduce((a: number, b: number) => a + b, 0);
  const shippingValue = currentOrder?.shipping_options?.value || 0;
  const subtotalWithShipping = subtotal + shippingValue;
  const totalTaxAmount = subtotal * totalFee;

  return (
    <>
      <TableContainer component={Paper}>
        <Scrollbar>
          <Table>
            <TableHead>
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
                      gap: '5px',
                    }}
                  >
                    {headCell.label}
                  </Box>
                </TableCell>
              ))}
            </TableHead>
            <TableBody>
              {currentOrder?.order_itens.map((order: any, index: any) => (
                <TableRow
                  key={order.order_id}
                  sx={{
                    borderBottom: '1px solid #C4C4C4',
                    ...(index === currentOrder.order_itens.length - 1 && { borderBottom: 'none' }),
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      whiteSpace: 'nowrap',
                      paddingLeft: '2rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    <Typography variant="subtitle2" noWrap>
                      {order.product_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" noWrap>
                      {order.quantity}{' '}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" noWrap>
                      R${order.product_value.toFixed(2).replace('.', ',')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Stack sx={{ display: 'flex', alignItems: 'end', mt: 2, gap: 2, paddingRight: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Entrega feita por: {currentOrder?.shipping_options?.name}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Valor da Entrega: R${shippingValue.toFixed(2).replace('.', ',')}
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Total de Taxas: R${totalTaxAmount.toFixed(2).replace('.', ',')} (
          {(totalFee * 100).toFixed(0)}%)
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Subtotal: R$
          {subtotalWithShipping.toFixed(2).replace('.', ',')}
        </Typography>
      </Stack>
    </>
  );
}

export default TableDetails;

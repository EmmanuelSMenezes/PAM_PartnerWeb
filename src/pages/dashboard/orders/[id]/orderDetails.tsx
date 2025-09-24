import { Button, Card, Container, Stack, TextField } from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import useResponsive from 'src/hooks/useResponsive';
import { paramCase } from 'change-case';
import { useRouter } from 'next/router';
import { getOrderDetails } from 'src/service/order';
import { IOrderDetails } from 'src/@types/order';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { formatValue, maskPhone } from 'src/utils/formatNumber';
import TableDetails from '../components/tableDetails';
import AddressForm from '../components/addressForm';
import Payment from '../components/payment';

OrderDetails.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrderDetails() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const { push } = useRouter();
  const isDesktop = useResponsive('up', 'lg');
  const { partnerOrdersList, setCurrentOrder } = useGlobalContext();
  const [orderDetails, setOrderDetails] = useState<IOrderDetails>();

  const {
    query: { id },
  } = useRouter();

  const currentOrder = partnerOrdersList?.orders?.find(
    (order: any) => paramCase(order.order_id) === id
  );

  const getDetails = async () => {
    try {
      const response = await getOrderDetails(currentOrder?.order_id);
      setOrderDetails(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <Head>
        <title> Parceiro | Detalhes do Pedido</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detalhes do Pedido"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Detalhes do Pedido' }]}
        />

        <Card sx={{ p: 3, gap: '1rem' }}>
          <TableDetails currentOrder={orderDetails} />
          <AddressForm currentOrder={orderDetails} />
          <Payment currentOrder={orderDetails} />

          <Stack sx={{ display: 'flex', gap: '1rem', mt: 3 }}>
            <Stack spacing={2} direction={isDesktop ? 'row' : 'column'}>
              <TextField
                disabled
                fullWidth
                label="ID Pedido"
                value={orderDetails?.order_number}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                disabled
                fullWidth
                label="Telefone"
                InputLabelProps={{ shrink: true }}
                value={
                  orderDetails?.consumer.phone_number
                    ? maskPhone(orderDetails.consumer.phone_number)
                    : ''
                }
              />
              <TextField
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={orderDetails?.status_name}
                label="Status do Pedido"
              />
            </Stack>
          </Stack>
          <Stack spacing={0} sx={{ gap: '1rem', mt: 2, display: 'flex', flexDirection: 'row' }}>
            {orderDetails && (
              <TextField
                name="troco"
                disabled
                fullWidth
                value={`R$ ${formatValue(orderDetails?.change)}`}
                label="Troco:"
                InputLabelProps={{ shrink: true }}
              />
            )}

            <TextField
              disabled
              fullWidth
              name="notes"
              value={orderDetails?.observation}
              label="Observações do Cliente:"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack
            spacing={0}
            direction={isDesktop ? 'row' : 'column'}
            sx={{ gap: 1, mt: 2, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              type="button"
              color="inherit"
              variant="contained"
              disabled={
                currentOrder?.status_name === 'Pendente' ||
                currentOrder?.status_name === 'Concluído' ||
                currentOrder?.status_name === 'Recusado' ||
                currentOrder?.status_name === 'Aceito' ||
                currentOrder?.status_name === 'Aguardando pagamento' ||
                currentOrder?.status_name === 'Cancelado pelo cliente'
              }
              onClick={() => {
                setCurrentOrder(currentOrder);
                push(PATH_DASHBOARD.chatConsumer.root);
              }}
              // loading={isSubmitting}
              sx={{
                gap: 1,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Falar com consumidor{' '}
              <Icon icon="ph:chat-centered-dots-light" width="30" height="30" />
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}

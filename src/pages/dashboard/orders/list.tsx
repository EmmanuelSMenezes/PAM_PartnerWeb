import { Container } from '@mui/system';
import Head from 'next/head';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import OrdersListCart from './view';

OrdersListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrdersListPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Parceiro | Histórico de Pedidos</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Histórico de Pedidos"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Histórico' }]}
        />
        <OrdersListCart />
      </Container>
    </>
  );
}

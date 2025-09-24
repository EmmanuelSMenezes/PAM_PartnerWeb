// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import NewActuationForm from './components/new';

// ----------------------------------------------------------------------

ActuationAreaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function ActuationAreaPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Parceiro | Nova Filial</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Nova Área de Atuação"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Nova Área',
            },
          ]}
        />

        <NewActuationForm />
      </Container>
    </>
  );
}

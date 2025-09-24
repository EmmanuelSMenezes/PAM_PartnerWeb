// next
import Head from 'next/head';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import CreateMapAreaForm from './components/CreateMapAreaForm';

ActuationAreaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function ActuationAreaPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Parceiro | Criação de Área de Atuação</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Criação de Área de Atuação "
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Área de Atuação',
            },
          ]}
        />

        <CreateMapAreaForm />
      </Container>
    </>
  );
}

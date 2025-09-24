import Head from 'next/head';
import NextLink from 'next/link';
import { Button, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import AreaList from './areaList';

NewActuationAreaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function NewActuationAreaPage() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();

  return (
    <>
      <Head>
        <title> PAM | Área de Atuação</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Área de Atuação"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Área de Atuação',
            },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.area.new}
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Criar Nova
            </Button>
          }
        />
        <AreaList />
      </Container>
    </>
  );
}

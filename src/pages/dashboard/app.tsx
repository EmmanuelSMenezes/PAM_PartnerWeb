import Head from 'next/head';
import { Container, Grid } from '@mui/material';
import { useAuthContext } from '../../auth/useAuthContext';
import DashboardLayout from '../../layouts/dashboard';
import { useSettingsContext } from '../../components/settings';
import { AppWelcome } from '../../sections/@dashboard/general/app';
import { SeoIllustration } from '../../assets/illustrations';

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function GeneralAppPage() {
  const { user } = useAuthContext();

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Parceiro</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Bem vindo de volta! \n ${user?.profile?.fullname}`}
              description="Aqui você pode acompanhar as últimas atualizações relacionadas ao seu negócio."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

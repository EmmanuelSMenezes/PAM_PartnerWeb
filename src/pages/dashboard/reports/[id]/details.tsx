import { Button, Card, Container, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useTheme } from '@mui/material/styles';
// import useResponsive from 'src/hooks/useResponsive';
// import { paramCase } from 'change-case';
import { useRouter } from 'next/router';

OrderDetails.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrderDetails() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  // const { push } = useRouter();
  const router = useRouter();
  //   const isDesktop = useResponsive('up', 'lg');

  const {
    query: { id },
  } = useRouter();

  return (
    <>
      <Head>
        <title> Parceiro | Detalhes do Relatório</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detalhes do Relatório"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Detalhes do Pedido' }]}
        />

        <Card sx={{ p: 3, gap: '1rem' }}>
          <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h5"
              paragraph
              sx={{
                backgroundColor: '#f2f3f5',
                p: 1,
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              Relatório {id}:
            </Typography>
          </Stack>

          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // flexDirection: 'row',
            }}
          >
            <Typography variant="body1" paragraph>
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nostrum eos
              dolorum tempore est ipsam ipsa quo facere, officiis modi doloribus culpa perferendis
              veniam aliquid placeat beatae. Doloribus, ratione laborum. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Distinctio nostrum eos dolorum tempore est ipsam ipsa
              quo facere, officiis modi doloribus culpa perferendis veniam aliquid placeat beatae.
              Doloribus, ratione laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio nostrum eos dolorum tempore est ipsam ipsa quo facere, officiis modi
              doloribus culpa perferendis veniam aliquid placeat beatae. Doloribus, ratione laborum.
            </Typography>
          </Stack>

          <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Button
              variant="contained"
              color="inherit"
              // startIcon={<Iconify icon="ant-design:clear-outlined" />}
              onClick={() => router.back()}
              sx={{
                bgcolor: theme.palette.primary.dark,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.darker,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Voltar
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}

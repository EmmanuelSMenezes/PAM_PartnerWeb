import { m } from 'framer-motion';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Stack, Typography, useTheme } from '@mui/material';
// layouts
import CompactLayout from '../layouts/compact';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

Page404.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page404() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title> Parceiro | 404 Página Não Encontrada</title>
      </Head>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Ops! <br />
            Página não encontrada.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Desculpe, não conseguimos encontrar essa página. Talvez você tenha digitado errado a
            URL. Verifique o endereço digitado e tente novamente.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
        <Stack sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
              '&:hover': {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
              },
            }}
            component={NextLink}
            href="/dashboard"
            size="large"
            variant="contained"
          >
            Voltar
          </Button>
        </Stack>
      </MotionContainer>
    </>
  );
}

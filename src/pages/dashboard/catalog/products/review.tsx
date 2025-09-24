import Head from 'next/head';
import { Box, Card, Container, Grid, InputAdornment, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { Upload } from 'src/components/upload';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

ReviewForm.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function ReviewForm() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();

  return (
    <>
      <Head>
        <title> Parceiro | Criação de Novo Item</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Revisão do Item"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Revisão de Cadastro' },
          ]}
        />

        <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField label="Nome do Item">Nome</TextField>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Descrição">Descrição</TextField>

                  <Upload
                    multiple
                    thumbnail
                    // name="images"
                    maxSize={3145728}
                    onUpload={() => console.log('ON UPLOAD')}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField label="Categoria">Categoria</TextField>
                  <TextField label="Subcategoria">SubCategoria</TextField>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    name="price"
                    label="Preço mínimo:"
                    placeholder="0,00"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                      type: 'number',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label=" Informações e observações adicionais"
                    name="hello"
                    // placeholder="Descreva informações e observações adicionais sobre os itens e serviços..."
                  />
                </Box>
              </Stack>
            </Card>
            <Stack
              spacing={1}
              sx={{
                mt: 2,
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <LoadingButton
                // type="submit"
                color="inherit"
                variant="contained"
                size="large"
                // loading={isSubmitting}
                sx={{
                  width: '250px',
                  bgcolor: theme.palette.primary.dark,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.darker,
                    color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  },
                }}
              >
                salvar
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

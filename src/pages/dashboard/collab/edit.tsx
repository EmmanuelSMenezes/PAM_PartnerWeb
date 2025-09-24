import { Card, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Head from 'next/head';

import FormProvider, { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import Iconify from 'src/components/iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
import DashboardLayout from '../../../layouts/dashboard';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';

EditCollab.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

type FormValuesProps = {
  name: string;
  email: string;
  temporaryPassword: string;
};

const options = [
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'administrador', label: 'Administrador' },
];

export default function EditCollab() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const NewCollabSchema = Yup.object().shape({
    name: Yup.string().required('Nome é um campo obrigatório'),
    email: Yup.string().required('Email é um campo obrigatório').email('Informe um email válido'),
    temporaryPassword: Yup.string().required('Senha é um campo obrigatório'),
    login: Yup.string().oneOf(['colaborador', 'administrador'], 'Selecione um tipo de login'),
  });

  const defaultValues = {
    name: '',
    email: '',
    temporaryPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCollabSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    console.log('data', data);
  };

  return (
    <>
      <Head>
        <title> Parceiro | Gestão de Colaboradores</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading=" Gestão de Colaboradores "
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Gestão de Colaborador',
            },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Stack
                sx={{
                  display: 'flex',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Selecione o tipo de login:
                </Typography>
                <RHFRadioGroup
                  sx={{ display: 'flex', flexDirection: 'row' }}
                  name="login"
                  options={options}
                />
              </Stack>
              <Stack
                direction="row"
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <LoadingButton
                  type="button"
                  // variant="outlined"
                  loading={isSubmitting}
                  // sx={{ backgroundColor: theme.palette.warning.main }}
                >
                  <Tooltip title="Suspender Colaborador">
                    <IconButton color="primary">
                      <Iconify icon="eva:slash-outline" />
                    </IconButton>
                  </Tooltip>
                </LoadingButton>

                <LoadingButton
                  type="button"
                  // variant="outlined"
                  loading={isSubmitting}
                  // sx={{ backgroundColor: theme.palette.error.main }}
                >
                  <Tooltip title="Remover Colaborador">
                    <IconButton color="primary">
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </LoadingButton>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <RHFTextField name="name" label="Nome" />
              <RHFTextField name="document" label="Documento" />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <RHFTextField name="phone" label="Telefone" />
              <RHFTextField name="email" label="Email" />
              {/* <RHFTextField name="temporaryPassword" type="password" label="Senha" /> */}
            </Stack>

            {/* <Stack
              direction="row"
              alignItems="center"
              // alignContent="center"
              justifyContent="space-between"
              sx={{ mt: 2 }}
            > */}
            {/* <Stack direction="row" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ backgroundColor: theme.palette.primary.main }}
                >
                  Enviar email Cadastro
                </LoadingButton>
              </Stack> */}
            <Stack
              spacing={1}
              alignItems="flex-end"
              direction="row"
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <LoadingButton type="button" variant="contained" onClick={() => router.back()}>
                Voltar{' '}
              </LoadingButton>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Salvar Cadastro
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </>
  );
}

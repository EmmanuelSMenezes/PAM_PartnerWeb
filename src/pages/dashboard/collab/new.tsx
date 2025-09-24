import { Card, Container, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';
import { createCollaborator } from 'src/service/collaborator';
import { useSnackbar } from 'src/components/snackbar';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { maskCpfCnpj } from 'src/utils/formatNumber';
import { useTheme } from '@mui/material/styles';
import { PATH_DASHBOARD } from '../../../routes/paths';
import DashboardLayout from '../../../layouts/dashboard';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';

NewCollab.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

type FormValuesProps = {
  name: string;
  document: string;
  email: string;
};

export default function NewCollab() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const theme = useTheme();

  const NewCollabSchema = Yup.object().shape({
    name: Yup.string().required('Nome é um campo obrigatório'),
    email: Yup.string().required('Email é um campo obrigatório').email('Informe um email válido'),
    document: Yup.string()
      .required('CPF/CNPJ é obrigatório')
      .test('cpf-cnpj', 'CPF/CNPJ inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF/CNPJ é obrigatório'),
  });

  const defaultValues = {
    name: '',
    document: '',
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCollabSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleCpfChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setValue('document', maskedCpfCnpj);
  };

  const onSubmit = async (data: FormValuesProps) => {
    const newCollaborator = {
      sponsor_id: user?.user_id,
      fullname: data.name,
      document: data.document.replace(/\D/g, ''),
      email: data.email,
    };

    try {
      const response = await createCollaborator(newCollaborator);

      if (response) {
        enqueueSnackbar('Colaborador cadastrado com sucesso');
        push(PATH_DASHBOARD.collab.list);
      }
    } catch (error) {
      console.log(error);
      if (error.status) {
        enqueueSnackbar(
          'Não foi possível efetuar o cadastro. Há um usuário cadastrado com este e-mail.',
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar('Não foi possível cadastrar o colaborador', { variant: 'error' });
      }
    }
  };

  return (
    <>
      <Head>
        <title> Parceiro | Cadastrar Colaborador</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading=" Novo Colaborador "
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Novo Colaborador',
            },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 2 }}>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <RHFTextField
                  name="name"
                  label="*Nome"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <RHFTextField
                  name="document"
                  label="*CPF/CNPJ"
                  // value={formattedDocument}
                  onChange={handleCpfChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <RHFTextField
                  name="email"
                  label="*E-mail"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </Stack>
            <Stack
              alignItems="flex-end"
              direction="row"
              justifyContent="space-between"
              sx={{ mb: -1, mt: 2, color: '#555' }}
            >
              <Typography sx={theme.typography.caption}>*Preenchimento obrigatório.</Typography>
            </Stack>
          </Card>
          <Stack
            spacing={1}
            alignItems="flex-end"
            direction="row"
            justifyContent="end"
            sx={{ mt: 2 }}
          >
            <LoadingButton type="button" variant="contained" onClick={() => router.back()}>
              Voltar{' '}
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={watch('name') === '' || watch('document') === '' || watch('email') === ''}
            >
              Cadastrar
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}

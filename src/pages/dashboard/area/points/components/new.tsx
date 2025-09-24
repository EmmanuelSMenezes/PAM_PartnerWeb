import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useForm } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { createBranch } from 'src/service/partner';
import { maskCpfCnpj, maskPhone, maskZipCode } from 'src/utils/formatNumber';
import { getCoordinates } from 'src/utils/getCoordinates';
import * as Yup from 'yup';
import { useAuthContext } from 'src/auth/useAuthContext';

NewActuationForm.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

interface FormValuesProps {
  actuationName: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  neighborhood: string;
  city: string;
  zipcode: string;
  state: string;
  phoneNumber: string;
}

export default function NewActuationForm() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { partnerId } = useAuthContext();
  const { push } = useRouter();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formattedZip, setFormattedZip] = useState('');
  const [noFormattedZip, setNoFormattedZip] = useState('');

  const initialAddress = {
    street: '',
    city: '',
    neighborhood: '',
    state: '',
  };
  const [address, setAddress] = useState(initialAddress);

  const NewActuationSchema = Yup.object().shape({
    actuationName: Yup.string().required('Nome da atuação é obrigatório'),
    document: Yup.string()
      .required('CPF/CNPJ é obrigatório')
      .test('cpf-cnpj', 'CPF/CNPJ inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF/CNPJ é obrigatório'),
    street: Yup.string().required('Rua é obrigatória'),
    number: Yup.string().required('Número é obrigatório'),
    neighborhood: Yup.string().required('O bairro é obrigatório'),
    city: Yup.string().required('Cidade é obrigatória'),
    zipcode: Yup.string().required('CEP é obrigatório'),
    state: Yup.string().required('Estado é obrigatório'),
    phoneNumber: Yup.string().required('O telefone é um campo obrigatório'),
  });

  const defaultValues = {
    actuationName: '',
    document: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    zipcode: '',
    state: '',
    phoneNumber: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewActuationSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = maskZipCode(value.replace(/-/g, ''));
    setFormattedZip(formattedValue);
    const zipcodeNoFormat = value.replace(/-/g, '');
    setNoFormattedZip(zipcodeNoFormat);
    setValue('zipcode', value);
    if (value.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => {
          if (response.data.cep !== formattedValue) {
            setAddress(initialAddress);
          }
          setAddress({
            street: response.data.logradouro,
            neighborhood: response.data.bairro,
            city: response.data.localidade,
            state: response.data.uf,
          });
          setValue('city', response.data.localidade);
          setValue('street', response.data.logradouro);
          setValue('state', response.data.uf);
          setValue('neighborhood', response.data.bairro);
          setValue('complement', response.data.complemento);
          setValue('zipcode', formattedValue);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAddress(initialAddress);
    }
  };

  const handleCpfChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setValue('document', maskedCpfCnpj);
  };

  const handlePhoneChange = (event: { target: { value: string } }) => {
    const maskedPhone = maskPhone(event?.target.value);
    setValue('phoneNumber', maskedPhone);
  };

  const onSubmit = async (data: FormValuesProps) => {
    const newAddress = {
      street: data?.street,
      number: data?.number,
      complement: data?.complement,
      district: data?.neighborhood,
      city: data?.city,
      state: data?.state,
      zip_code: data.zipcode.replace(/\D/g, ''),
      latitude: '',
      longitude: '',
      created_by: partnerId?.partner_id,
    };

    try {
      const coordinates = await getCoordinates(newAddress);
      // const convertedCoordinates = proj4('EPSG:3857', 'EPSG:4326', [
      //   coordinates.latitude,
      //   coordinates.longitude,
      // ]);
      newAddress.latitude = coordinates.latitude.toString();
      newAddress.longitude = coordinates.longitude.toString();

      await createBranch({
        branch_name: data?.actuationName,
        document: data?.document.replace(/\D/g, ''),
        phone: data?.phoneNumber.replace(/\D/g, ''),
        partner_id: partnerId?.partner_id,
        address: newAddress,
      });
      push(PATH_DASHBOARD.area.branchList);
      enqueueSnackbar('Filial criada com sucesso');
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Não foi possível criar nova filial', { variant: 'error' });
    }
  };

  return (
    <>
      <Head>
        <title> Parceiro | Nova Filial</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Criar Nova"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Nova Filial',
            },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Stack
              spacing={{ xs: 4, md: 2 }}
              direction={{ xs: 'column', md: 'column' }}
              sx={{ p: 2 }}
            >
              <Stack spacing={1} direction="row" sx={{ display: 'flex' }}>
                <RHFTextField
                  name="actuationName"
                  label="*Nome:"
                  sx={{ flex: 5 }}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name="document"
                  sx={{ flex: 3 }}
                  label="*Documento:"
                  onChange={handleCpfChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: 0, maxlength: 18 } }}
                />

                <RHFTextField
                  name="phoneNumber"
                  // value={formattedPhone}
                  onChange={handlePhoneChange}
                  label="*Telefone:"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 2 }}
                />
              </Stack>

              <Stack direction="row" spacing={1}>
                <RHFTextField
                  name="zipcode"
                  sx={{ flex: 1 }}
                  // value={formattedZip}
                  onChange={handleZipCodeChange}
                  label="*CEP:"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: 0, maxlength: 9 } }}
                />
                <RHFTextField
                  name="street"
                  label="*Logradouro:"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 3 }}
                />

                <RHFTextField
                  name="number"
                  sx={{ flex: 1 }}
                  label="*Número:"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name="complement"
                  sx={{ flex: 2 }}
                  label="Complemento:"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <Stack spacing={1} direction="row" sx={{ display: 'flex' }}>
                <RHFTextField
                  label="*Bairro"
                  name="neighborhood"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 2 }}
                />

                <RHFTextField
                  label="*UF:"
                  name="state"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                />

                <RHFTextField
                  name="city"
                  label="*Cidade:"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 2 }}
                />
              </Stack>
            </Stack>
            <Stack
              alignItems="flex-end"
              direction="row"
              justifyContent="space-between"
              sx={{ m: 2, color: '#555' }}
            >
              <Typography sx={theme.typography.caption}>*Preenchimento obrigatório.</Typography>
            </Stack>
          </Card>

          <Stack justifyContent="flex-end" direction="row" spacing={1} sx={{ mt: 2 }}>
            <LoadingButton
              // size="large"
              color="inherit"
              type="button"
              variant="contained"
              onClick={() => router.back()}
              loading={isSubmitting}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Voltar
            </LoadingButton>
            <LoadingButton
              // size="large"
              color="inherit"
              type="submit"
              variant="contained"
              disabled={
                watch('actuationName') === '' ||
                watch('document') === '' ||
                watch('phoneNumber') === '' ||
                watch('zipcode') === '' ||
                watch('street') === '' ||
                watch('number') === ''
              }
              loading={isSubmitting}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Criar Filial
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}

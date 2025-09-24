import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Card, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getBranchUpdate } from 'src/service/partner';
import Head from 'next/head';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { PATH_DASHBOARD } from 'src/routes/paths';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';
import {
  maskCpfCnpj,
  maskPhone,
  maskZipCode,
  removeSpecialCharacter,
} from 'src/utils/formatNumber';
import { getCoordinates } from 'src/utils/getCoordinates';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import DashboardLayout from '../../../../../layouts/dashboard';

InvoiceEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface FormValuesProps {
  noFormattedZip: any;
  actuationName: string;
  street: string;
  number: string;
  document: string;
  complement: string;
  active: boolean;
  city: string;
  zipcode: string;
  phoneNumber: string;
  neighborhood: string;
  state: string;
}

export default function InvoiceEditPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { branchList } = useGlobalContext();
  const { partnerId } = useAuthContext();
  const theme = useTheme();
  const { push } = useRouter();
  const [formattedZip, setFormattedZip] = useState('');

  const initialAddress = {
    street: '',
    city: '',
    neighborhood: '',
    state: '',
  };

  const [address, setAddress] = useState(initialAddress);

  const {
    query: { id },
  } = useRouter();

  const currentBranch = branchList?.find((branch: any) => paramCase(branch.branch_id) === id);

  const NewActuationSchema = Yup.object().shape({
    actuationName: Yup.string().required('O nome da área é um campo obrigatório.'),
    street: Yup.string().required('A rua é um campo obrigatório.'),
    document: Yup.string()
      .required('CPF/CNPJ é obrigatório')
      .test('cpf-cnpj', 'CPF/CNPJ inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF/CNPJ é obrigatório'),
    number: Yup.string().required('O número é um campo obrigatório.'),
    phoneNumber: Yup.string().required('O número de telefone é um campo obrigatório.'),
    city: Yup.string().required('A cidade é um campo obrigatório.'),
    zipcode: Yup.string().required('O CEP é um campo obrigatório.'),
    neighborhood: Yup.string().required('O bairro é um campo obrigatório.'),
    state: Yup.string().required('O Estado é um campo obrigatório.'),
  });

  const defaultValues = useMemo(
    () => ({
      actuationName: currentBranch?.branch_name || '',
      street: currentBranch?.address?.street || '',
      number: currentBranch?.address?.number || '',
      phoneNumber: maskPhone(currentBranch?.phone) || '',
      state: currentBranch?.address?.state || '',
      neighborhood: currentBranch?.address?.district || '',
      complement: currentBranch?.address?.complement || '',
      document: maskCpfCnpj(currentBranch?.document) || '',
      city: currentBranch?.address?.city || '',
      zipcode: maskZipCode(currentBranch?.address?.zip_code) || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  const onSubmit = async (data: FormValuesProps) => {
    const formAddress = {
      street: data?.street,
      number: data?.number,
      district: data?.neighborhood,
      city: data?.city,
      zip_code: removeSpecialCharacter(data?.zipcode),
      state: data?.state,
      latitude: '',
      longitude: '',
      complement: data?.complement,
    };
    try {
      const coordinates = await getCoordinates(formAddress);

      // const convertedCoordinates = proj4('EPSG:3857', 'EPSG:4326', [
      //   coordinates.latitude,
      //   coordinates.longitude,
      // ]);
      formAddress.latitude = coordinates.latitude.toString();
      formAddress.longitude = coordinates.longitude.toString();

      if (coordinates) {
        const response = await getBranchUpdate({
          branch_name: data?.actuationName,
          branch_id: currentBranch?.branch_id,
          document: removeSpecialCharacter(data?.document),
          updated_by: partnerId?.partner_id,
          phone: removeSpecialCharacter(data?.phoneNumber),
          partner_id: partnerId?.partner_id,
          address: formAddress,
        });

        if (response) {
          push(PATH_DASHBOARD.area.branchList);
          enqueueSnackbar('Filial atualizada com sucesso');
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Não foi possível atualizar a filial', { variant: 'error' });
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

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeSpecialCharacter(event.target.value);
    const formattedValue = maskZipCode(value.replace(/-/g, ''));
    setFormattedZip(formattedValue);

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

  return (
    <>
      <Head>
        <title> Parceiro | Edição de Filial</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Editar Filial"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Filiais',
              href: PATH_DASHBOARD.area.new,
            },
            { name: currentBranch?.branch_name },
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
                  // value={formattedDocument}
                  onChange={handleCpfChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: 0, maxlength: 18 } }}
                />

                <RHFTextField
                  name="phoneNumber"
                  // value={formattedPhone}
                  onChange={handlePhoneChange}
                  label="*Telefone Comercial:"
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
              sx={{ mb: -2, mt: 2, color: '#555' }}
            >
              <Typography sx={theme.typography.caption}>*Preenchimento obrigatório.</Typography>
            </Stack>
          </Card>

          <Stack justifyContent="flex-end" direction="row" spacing={1} sx={{ mt: 2 }}>
            <LoadingButton
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
              color="inherit"
              type="submit"
              variant="contained"
              disabled={
                watch('actuationName') === currentBranch?.branch_name &&
                watch('document') === maskCpfCnpj(currentBranch?.document) &&
                watch('phoneNumber') === maskPhone(currentBranch?.phone) &&
                watch('zipcode') === maskZipCode(currentBranch?.address?.zip_code) &&
                watch('street') === currentBranch?.address?.street &&
                watch('number') === currentBranch?.address?.number &&
                watch('neighborhood') === currentBranch?.address?.district &&
                watch('city') === currentBranch?.address?.city &&
                watch('complement') === currentBranch?.address?.complement
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
              Atualizar Filial
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}

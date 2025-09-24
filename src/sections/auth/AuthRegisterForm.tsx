import { useForm } from 'react-hook-form';
// @mui
import { Stack, Typography, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IResponsePartner } from 'src/@types/partner';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  cpf: string;
  address: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
};
export default function AuthRegisterForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { setIsAuthenticated, setIsInitialized } = useAuthContext();
  const [isCheckedAddress, setIsCheckedAddress] = useState(false);
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [partnerData, setPartnerData] = useState<IResponsePartner | null>(null);

  const defaultValues = {
    name: partnerData?.legal_name || '',
    email: partnerData?.email || '',
    phone: partnerData?.phone_number || '',
    cnpj: partnerData?.document || '',
    address: partnerData?.branch[0]?.address.street || '',
    address_number: partnerData?.branch[0]?.address.number || '',
    complement: partnerData?.branch[0]?.address.complement || '',
    neighborhood: partnerData?.branch[0]?.address.district || '',
    city: partnerData?.branch[0]?.address.city || '',
    state: partnerData?.branch[0]?.address.state || '',
    zip_code: partnerData?.branch[0]?.address.zip_code || '',
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClick = () => {
    if (isCheckedTerms && isCheckedPolicy) {
      setIsAuthenticated(true);
      setIsInitialized(true);
    } else if (!isCheckedTerms && !isCheckedPolicy) {
      enqueueSnackbar(
        'Para continuar é necessário aceitar os Termos de Serviço e a Política de Privacidade.',
        {
          variant: 'error',
        }
      );
    } else if (!isCheckedTerms) {
      enqueueSnackbar('Para continuar é necessário aceitar os Termos de Serviço.', {
        variant: 'error',
      });
    } else if (!isCheckedPolicy) {
      enqueueSnackbar('Para continuar é necessário aceitar a Política de Privacidade.', {
        variant: 'error',
      });
    }
  };

  const getPartnerData = async () => {
    // const userId = user?.profile.user_id ?? '';
    // try {
    //   if (user?.profile.user_id) {
    //     const response = await getPartnerById(userId);
    //     setValue('name', response?.legal_name);
    //     setValue('email', response?.email);
    //     setValue('phone', response?.phone_number);
    //     setValue('cnpj', response?.document);
    //     setValue('address', response?.branch[0]?.address.street);
    //     setValue('address_number', response?.branch[0]?.address.number);
    //     setValue('complement', response?.branch[0]?.address.complement);
    //     setValue('neighborhood', response?.branch[0]?.address.district);
    //     setValue('city', response?.branch[0]?.address.city);
    //     setValue('state', response?.branch[0]?.address.state);
    //     setValue('zip_code', response?.branch[0]?.address.zip_code);
    //     setPartnerData(response);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    getPartnerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormValuesProps) => {
    setIsEditing(true);
    // console.log('form data:', data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            disabled={!isEditing}
            name="name"
            label="Nome / Razão social"
            InputLabelProps={{ shrink: true }}
          />

          <RHFTextField
            disabled={!isEditing}
            name="email"
            label="E-mail"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            disabled={!isEditing}
            name="phone"
            label="Telefone"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField
            name="cnpj"
            label="CPF / CNPJ "
            disabled={!isEditing}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            disabled={!isEditing}
            name="address"
            label="Logradouro"
            sx={{ flex: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <RHFTextField
            disabled={!isEditing}
            name="address_number"
            label="Número"
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            disabled={!isEditing}
            name="complement"
            label="Complemento"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField
            disabled={!isEditing}
            name="neighborhood"
            label="Bairro"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <RHFTextField
            disabled={!isEditing}
            name="city"
            label="Cidade"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField
            disabled={!isEditing}
            name="state"
            label="Estado"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField
            disabled={!isEditing}
            name="zip_code"
            label="CEP"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Stack sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            component="div"
            sx={{
              color: 'text.secondary',
              typography: 'caption',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Checkbox size="small" onChange={(e) => setIsCheckedAddress(e.target.checked)} />

            <div>{'Confirmo que todas as informações exibidas no cadastro estão corretas. '}</div>
          </Typography>
          <Typography
            component="div"
            sx={{
              color: 'text.secondary',
              typography: 'caption',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Checkbox size="small" onChange={(e) => setIsCheckedTerms(e.target.checked)} />

            <div>{'Aceito os Termos de Serviço. '}</div>
          </Typography>
          <Typography
            component="div"
            sx={{
              color: 'text.secondary',
              typography: 'caption',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Checkbox size="small" onChange={(e) => setIsCheckedPolicy(e.target.checked)} />

            <div>{'Aceito a Política de Privacidade. '}</div>
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            onClick={(e) => handleClick()}
            loading={isSubmitting}
            // disabled={!(isCheckedTerms && isCheckedPolicy && isCheckedAddress)}
          >
            Continuar
          </LoadingButton>

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              '&:hover': {
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              },
            }}
          >
            {isEditing ? 'Enviar alteração cadastral' : 'Solicitar alteração cadastral'}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

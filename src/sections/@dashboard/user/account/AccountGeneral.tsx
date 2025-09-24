import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Card, Stack, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useSnackbar } from 'notistack';
import { getPartnerById, getBranchUpdate } from 'src/service/partner';
import { getCoordinates } from 'src/utils/getCoordinates';
import axios from 'axios';
import { getUpdateUser } from 'src/service/session';
import { IResponsePartner } from 'src/@types/partner';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../../auth/useAuthContext';
import {
  fData,
  maskCpfCnpj,
  maskPhone,
  maskZipCode,
  removeSpecialCharacter,
} from '../../../../utils/formatNumber';
import { CustomFile } from '../../../../components/upload';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

type FormValuesProps = {
  photoURL: CustomFile | string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  address: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser, partnerId } = useAuthContext();

  const initialAddress = {
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  };

  const [partnerData, setPartnerData] = useState<IResponsePartner | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const [address, setAddress] = useState(initialAddress);
  // const { setBankAccount } = useGlobalContext();
  const [formattedZip, setFormattedZip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;
  const storedPamPartner = localStorage.getItem('@PAM:partner');
  const parsedPamPartner = storedPamPartner !== null ? JSON.parse(storedPamPartner) : null;

  const UpdateUserSchema = Yup.object().shape({
    photoURL: Yup.mixed().required('Avatar is required'),
    name: Yup.string().required('Defina um nome para a área'),
    email: Yup.string().required('Defina um nome para a área'),
    phone: Yup.string().required('O número de telefone é um campo obrigatório.'),
    cnpj: Yup.string()
      .required('CPF/CNPJ é obrigatório')
      .test('cpf-cnpj', 'CPF/CNPJ inválido', (value) => {
        if (!value) return false;
        return cpf.isValid(value) || cnpj.isValid(value);
      })
      .required('CPF/CNPJ é obrigatório'),
    address: Yup.string().required('Logradouro é um campo obrigatório.'),
    address_number: Yup.string().required('Número é um campo obrigatório'),
    complement: Yup.string(),
    neighborhood: Yup.string().required('O bairro é um campo obrigatório.'),
    city: Yup.string().required('A cidade é um campo obrigatório.'),
    state: Yup.string().required('O Estado é um campo obrigatório.'),
    zip_code: Yup.string().required('O CEP é um campo obrigatório.'),
  });

  const defaultValues = {
    photoURL: parsedPamPartner.profile.avatar || '',
    name: '',
    email: '',
    phone: '',
    cnpj: '',
    address: '',
    address_number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const getPartnerData = async () => {
    try {
      const response = await getPartnerById(userId);
      const mainBranch = response.branch.filter(
        (branch) => branch.branch_name === response.legal_name
      );
      setValue('name', response?.legal_name);
      setValue('email', response?.email);
      setValue('phone', maskPhone(response?.phone_number));
      setValue('cnpj', maskCpfCnpj(response?.document));
      setValue('address', mainBranch[0]?.address.street);
      setValue('address_number', mainBranch[0]?.address.number);
      setValue('complement', mainBranch[0]?.address.complement);
      setValue('neighborhood', mainBranch[0]?.address.district);
      setValue('city', mainBranch[0]?.address.city);
      setValue('state', mainBranch[0]?.address.state);
      setValue('zip_code', maskZipCode(mainBranch[0]?.address.zip_code));
      setValue('photoURL', response?.avatar, { shouldValidate: true });

      setFormattedZip(maskZipCode(mainBranch[0]?.address.zip_code));

      setPartnerData({
        partner_id: response?.partner_id,
        identifier: response?.identifier,
        legal_name: response?.legal_name,
        fantasy_name: response?.fantasy_name,
        document: response?.document,
        email: response?.email,
        phone_number: response?.phone_number,
        branch: mainBranch,
        user_id: response?.user_id,
        admin_id: response?.admin_id,
        avatar: response?.avatar,
        active: response?.active,
        created_by: response?.created_by,
        updated_by: response?.updated_by,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeSpecialCharacter(event.target.value);
    const formattedValue = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    setFormattedZip(formattedValue);
    setValue('zip_code', value);
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
          setValue('neighborhood', response.data.bairro);
          setValue('address', response.data.logradouro);
          setValue('state', response.data.uf);
          setValue('zip_code', formattedValue);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAddress(initialAddress);
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    setIsLoading(true);
    const newAddress = {
      street: data?.address,
      number: data?.address_number,
      city: data?.city,
      state: data?.state,
      zip_code: removeSpecialCharacter(data.zip_code),
    };
    try {
      if (partnerData !== null) {
        const userResponse = await getUpdateUser({
          fullName: user?.profile?.fullname,
          phone: user?.phone,
          email: user?.email,
          avatar: data?.photoURL,
          document: partnerData?.document,
          user_id: user?.user_id,
        });

        const coordinates = await getCoordinates(newAddress);
        const response = await getBranchUpdate({
          branch_id: partnerData?.branch[0]?.branch_id,
          branch_name: partnerData?.branch[0]?.branch_name,
          document: partnerData?.document,
          phone: partnerData?.phone_number,
          partner_id: partnerId?.partner_id,
          updated_by: userId,
          address: {
            address_id: partnerData?.branch[0]?.address.address_id,
            street: data.address,
            number: data.address_number,
            complement: data.complement,
            district: data.neighborhood,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            active: true,
            updated_by: userId,
            latitude: coordinates.latitude.toString(),
            longitude: coordinates.longitude.toString(),
          },
        });

        setPartnerData(response);
        localStorage.setItem('@PAM:partner', JSON.stringify(userResponse));
        setUser(userResponse);
        setIsLoading(false);

        enqueueSnackbar('Dados atualizados com sucesso', { variant: 'success' });
        getPartnerData();
      }
      setIsFormSubmitted(true);
      setIsEdit(false);
    } catch (error) {
      enqueueSnackbar('Não foi possível atualizar os dados', { variant: 'error' });
      console.log(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
        setIsEdit(true);
      }
    },
    [setValue]
  );

  const handleCpfChange = (event: { target: { value: string } }) => {
    const maskedCpfCnpj = maskCpfCnpj(event.target.value);
    setValue('cnpj', maskedCpfCnpj);
  };

  const handlePhoneChange = (event: { target: { value: string } }) => {
    const maskedPhone = maskPhone(event?.target.value);
    setValue('phone', maskedPhone);
  };

  useEffect(() => {
    getPartnerData();
  }, []);

  useEffect(() => {
    if (methods.formState.isDirty) {
      setIsEdit(true);
    }
  }, [
    methods.formState.isDirty,
    watch('address'),
    watch('address_number'),
    watch('zip_code'),
    watch('complement'),
    watch('neighborhood'),
    watch('city'),
    watch('state'),
  ]);

  useEffect(() => {
    if (isFormSubmitted && isEdit) {
      setIsEdit(false);
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, isEdit]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 2, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> tamanho máximo de {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '345px',
                }}
              >
                <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
              </div>
            ) : (
              <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <RHFTextField
                    name="name"
                    label="Nome / Razão social"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <RHFTextField
                    disabled
                    name="email"
                    label="E-mail"
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
                  <RHFTextField
                    name="phone"
                    label="Telefone"
                    onChange={handlePhoneChange}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <RHFTextField
                    name="cnpj"
                    label="CPF / CNPJ "
                    onChange={handleCpfChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputProps: { min: 0, max: 18 } }}
                    disabled
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <RHFTextField
                    name="zip_code"
                    label="*CEP"
                    value={formattedZip}
                    onChange={handleZipCodeChange}
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputProps: { min: 0, max: 9 } }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                  <RHFTextField
                    name="address"
                    // onChange={() => handleChange()}
                    label="*Logradouro"
                    sx={{ flex: 3 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
                  <RHFTextField
                    name="address_number"
                    label="*Número"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                  <RHFTextField
                    name="complement"
                    label="Complemento"
                    sx={{ flex: 5 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField
                    name="neighborhood"
                    label="*Bairro"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 3 }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                  <RHFTextField
                    name="city"
                    label="*Cidade"
                    sx={{ flex: 2 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                  <RHFTextField
                    sx={{ flex: 1 }}
                    name="state"
                    label="*Estado"
                    InputLabelProps={{ shrink: true }}
                    disabled={parsedPamPartner?.isCollaborator}
                  />
                </Stack>
              </>
            )}
          </Card>
          <Stack
            // spacing={3}
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              gap: '5px',
            }}
          >
            <LoadingButton
              color="inherit"
              type="button"
              size="medium"
              variant="contained"
              // loading={isSubmitting}
              onClick={() => router.back()}
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
              type="submit"
              variant="contained"
              size="medium"
              loading={isSubmitting}
              disabled={!isEdit}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Salvar alterações
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

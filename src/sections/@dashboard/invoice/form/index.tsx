import { useMemo } from 'react';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getBranchUpdate } from 'src/service/partner';

import { useAuthContext } from 'src/auth/useAuthContext';
import { removeSpecialCharacter } from 'src/utils/formatNumber';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';

interface FormValuesProps {
  actuationName: string;
  street: string;
  number: string;
  document: string;
  complement: string;
  city: string;
  zipcode: string;
  phoneNumber: string;
  neighborhood: string;
  state: string;
}

type Props = {
  isEdit?: boolean;
  currentBranch: string;
};

export default function ActuationAreaForm({ isEdit, currentBranch }: Props) {
  const theme = useTheme();
  const { user, setUser, partnerId } = useAuthContext();

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  // const [loadingSend, setLoadingSend] = useState(false);

  const NewActuationSchema = Yup.object().shape({
    actuationName: Yup.string().required('O nome da área é um campo obrigatório.'),
    street: Yup.array().required('A rua é um campo obrigatório.'),
    document: Yup.array().required('A rua é um campo obrigatório.'),
    number: Yup.array().required('O número é um campo obrigatório.'),
    complement: Yup.string().required('O complemento é um campo obrigatório.'),
    city: Yup.string().required('A cidade é um campo obrigatório.'),
    zipcode: Yup.number().required('O CEP é um campo obrigatório.'),
    neighborhood: Yup.number().required('O CEP é um campo obrigatório.'),
    state: Yup.number().required('O CEP é um campo obrigatório.'),
  });

  const defaultValues = useMemo(
    () => ({
      actuationName: '',
      street: '',
      number: '',
      state: '',
      neighborhood: '',
      complement: '',
      document: '',
      city: '',
      zipcode: '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewActuationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const formAddress = {
      street: data?.street,
      number: data?.number,
      district: data?.neighborhood,
      city: data?.city,
      zip_code: data?.zipcode,
      state: data?.state,
    };
    try {
      await getBranchUpdate({
        branch_name: data?.actuationName,
        branch_id: currentBranch,
        document: data?.document,
        partner_id: partnerId?.partner_id,
        phone: removeSpecialCharacter(data?.phoneNumber),
        updated_by: userId,
        address: formAddress,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={{ xs: 4, md: 2 }} direction={{ xs: 'column', md: 'column' }} sx={{ p: 2 }}>
          <Stack spacing={2} direction="row" sx={{ display: 'flex' }}>
            <RHFTextField
              name="actuationName"
              label="Keila:"
              sx={{ flex: 3 }}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="document"
              sx={{ flex: 2 }}
              label="Documento:"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="phoneNumber"
              label="Telefone Comercial:"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <RHFTextField
              name="zipcode"
              sx={{ flex: 1 }}
              // value={formattedZip}
              // onChange={handleZipCodeChange}
              label="CEP:"
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              name="street"
              label="Logradouro:"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 3 }}
            />

            <RHFTextField
              name="number"
              sx={{ flex: 1 }}
              label="Número:"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="complement"
              sx={{ flex: 2 }}
              label="Complemento:"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack spacing={2} direction="row" sx={{ display: 'flex' }}>
            <RHFTextField
              label="Bairro"
              name="neighborhood"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 2 }}
            />

            <RHFTextField
              label="UF:"
              name="state"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />

            <RHFTextField
              name="city"
              label="Cidade:"
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

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          color="inherit"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          // onClick={() => push(PATH_DASHBOARD.area.map)}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
            '&:hover': {
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
            },
          }}
        >
          {isEdit ? 'Atualizar Área' : 'Criar Área'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { forgotPassword } from 'src/service/session';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'notistack';
import { RoleUser } from 'src/@types/user';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function AuthResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuthContext();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('O e-mail deve ser um endereço de e-mail válido'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    // defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await forgotPassword({
        token,
        email: data.email,
        roleName: RoleUser.PART,
      });
      enqueueSnackbar('E-mail encaminhado com sucesso', { variant: 'success' });
    } catch (error) {
      if (error.message === 'Internal server error! Exception Detail: userNotExists') {
        enqueueSnackbar('E-mail não cadastrado.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Não foi possível encaminhar o e-mail, tente novamente', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="E-mail" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Enviar e-mail
      </LoadingButton>
    </FormProvider>
  );
}

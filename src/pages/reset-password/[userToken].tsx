import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useSnackbar } from 'notistack';
import { resetPassword } from 'src/service/session';
import CompactLayout from 'src/layouts/compact';
import { useRouter } from 'next/router';
// auth
// import { useAuthContext } from '../../auth/useAuthContext';
// components
import { PATH_AUTH } from 'src/routes/paths';
import { PasswordIcon } from 'src/assets/icons';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

Token.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

type FormValuesProps = {
  password: string;
  passwordConfirmation: string;
};

export default function Token() {
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const {
    query: { userToken },
  } = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('A senha deve conter 8 dígitos, incluindo letra maiúscula e caractere especial.')
      .required('A senha é um campo obrigatório')
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .matches(/.*[A-Z].*/, 'A senha deve conter pelo menos uma letra maiúscula')
      .matches(/.*[!@#$%^&*()].*/, 'A senha deve conter pelo menos um caractere especial'),
    passwordConfirmation: Yup.string()
      .required('As senhas devem ser iguais.')
      .oneOf([Yup.ref('password')], 'As senhas devem ser iguais.'),
  });

  const defaultValues = {
    password: '',
    passwordConfirmation: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    // reset,
    // setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { password, passwordConfirmation } = data;
    if (userToken && typeof userToken === 'string') {
      try {
        await resetPassword({ token: userToken, password, passwordConfirmation });
        push(PATH_AUTH.login);
        enqueueSnackbar('Senha atualizada com sucesso!', {
          variant: 'success',
        });
      } catch (error) {
        console.log(error);
        if (error.status === 400) {
          enqueueSnackbar(
            'Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.',
            {
              variant: 'error',
            }
          );
        } else if (error.status === 500) {
          enqueueSnackbar('Erro interno no servidor. Tente novamente mais tarde.', {
            variant: 'error',
          });
        } else {
          enqueueSnackbar('Não foi possível alterar a senha, tente novamente mais tarde.', {
            variant: 'error',
          });
        }
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Altere sua senha
      </Typography>
      <Stack spacing={2}>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Insira uma nova senha com 8 dígitos, incluindo letra maiúscula e caractere especial.
        </Typography>
        <RHFTextField
          name="password"
          label="Nova Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="passwordConfirmation"
          label="Confirmar Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        {/* <LoadingButton
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
          Alterar Senha
        </LoadingButton> */}
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Salvar senha
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

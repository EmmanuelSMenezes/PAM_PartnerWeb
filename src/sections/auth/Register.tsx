import { Stack, Typography } from '@mui/material';
import FirstAccessLayout from '../../layouts/firstAccess';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <FirstAccessLayout title="">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Dados do Cadastro</Typography>
      </Stack>

      <AuthRegisterForm />

      {/* <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, mb: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'Ao clicar em continuar, eu concordo com os '}
        <Link underline="always" color="text.primary">
          Termos de serviço
        </Link>
        {' e a '}
        <Link underline="always" color="text.primary">
          Política de Privacidade
        </Link>
        .
      </Typography> */}

      {/* <AuthWithSocial /> */}
    </FirstAccessLayout>
  );
}

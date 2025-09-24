import Head from 'next/head';
import { Typography } from '@mui/material';
import CompactLayout from '../../layouts/compact';
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
import { SentIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

NewPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Head>
        <title> Nova Senha | Minimal UI</title>
      </Head>
      <SentIcon sx={{ mb: 3, height: 96 }} />

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Escolha uma senha que tenha no mínimo 8 dígitos, inclua um caractere especial e uma letra
        maiúscula.
      </Typography>

      <AuthNewPasswordForm />
    </>
  );
}

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Container, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { createMapArea } from 'src/service/area';
import { parseCoordinatesTo4326 } from 'src/utils/coordinates';
import * as Yup from 'yup';
import { useAuthContext } from 'src/auth/useAuthContext';
import { paramCase } from 'change-case';
import FormProvider from 'src/components/hook-form';
import Map from '../../../../sections/@dashboard/map/index';
import GlobalStyle from '../../../../styles/styles';

MapForm.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface FormValuesProps {
  name: string;
}

export default function MapForm() {
  const theme = useTheme();
  const router = useRouter();
  const { push } = useRouter();
  const { coords, branchData } = useGlobalContext();
  const { partnerId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isMapDrawn, setIsMapDrawn] = useState(false);
  const [isDrawend, setIsDrawend] = useState<boolean>(false);

  const schema = Yup.object().shape({
    name: Yup.string().required('Defina um nome para a área'),
  });

  const defaultValues = {
    name: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async () => {
    const data = getValues();
    if (coords) {
      coords.features[0].properties = {
        partner_id: String(partnerId?.partner_id),
        name: data.name,
        branch_id: branchData?.branch_id,
      };
    }
    try {
      const response = await createMapArea(parseCoordinatesTo4326(coords));

      if (response) {
        push(
          PATH_DASHBOARD.area.config(paramCase(response.features[0].properties.actuation_area_id))
        );
      }
    } catch (error) {
      enqueueSnackbar('Não foi possível vincular área', { variant: 'error' });
      console.log(error);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  const handleMapDrawn = () => {
    setIsMapDrawn(true);
  };

  return (
    <Container>
      <Head>
        <title> Parceiro | Desenhar Área</title>
      </Head>
      <CustomBreadcrumbs
        heading="Definição da Área de Atuação "
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          {
            name: 'Área de Atuação',
          },
        ]}
      />{' '}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                sx={{ flex: 1, mb: 2 }}
                label="Nome:"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                required
              />
            )}
          />
        </Stack>
        <Stack sx={{ position: 'relative', height: '400px', width: '100%', mb: 2 }}>
          <Map onDrawn={handleMapDrawn} isDrawend={(value: any) => setIsDrawend(value)} />
          <GlobalStyle />
        </Stack>
        <Stack
          spacing={1}
          sx={{
            mt: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <LoadingButton
            // size="large"
            color="inherit"
            type="button"
            variant="contained"
            // loading={isSubmitting}
            onClick={handleVoltar}
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
            loading={isSubmitting}
            disabled={!isDrawend}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
              '&:hover': {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
              },
            }}
          >
            Salvar
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}

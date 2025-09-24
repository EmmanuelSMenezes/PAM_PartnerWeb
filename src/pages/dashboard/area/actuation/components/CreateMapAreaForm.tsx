import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Table,
  TableHead,
  TableCell,
  Box,
  TableBody,
  TableContainer,
  FormLabel,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { TableEmptyRows, emptyRows, useTable } from 'src/components/table';
import products from 'src/@types/products';
import AreaTableRow from 'src/pages/dashboard/area/actuation/components/AreaTableRow';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useTheme } from '@mui/material/styles';
import { hexToRgb } from 'src/utils/hexToRgb';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';

const TABLE_HEAD = [
  { id: '', label: '' },
  { id: 'createDate', label: 'Endereço de Atuação', align: 'center', width: '100%' },
];

export type FormValuesProps = {};

export default function CreateMapAreaForm() {
  const { dense, page, rowsPerPage, selected, onSelectRow } = useTable({
    defaultOrderBy: 'createDate',
  });

  const theme = useTheme();
  const { push } = useRouter();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    cover: Yup.mixed().required('Cover is required'),
    content: Yup.string().required('Content is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    content: '',
    cover: null,
    tags: ['The Kid'],
    publish: true,
    comments: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  };

  const denseHeight = dense ? 56 : 76;

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    push(PATH_DASHBOARD.area.map);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   handleClosePreview();
    //   enqueueSnackbar('Post success!');

    //   console.log('DATA', data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1}>
        <RHFTextField name="name" label="Nome da Área" />
      </Stack>
      <Stack spacing={1} sx={{ mt: 2, justifyContent: 'center', pl: '4px' }}>
        <FormLabel component="legend" sx={{ typography: 'body2' }}>
          Selecione abaixo o endereço de atuação correspondente a nova área.
        </FormLabel>
      </Stack>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, borderRadius: '8px', mt: 2 }}>
          <Table>
            <TableHead>
              {TABLE_HEAD.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align="center"
                  sx={{
                    backgroundColor: `rgba(${hexToRgb(theme.palette.primary.main)[0]}, ${
                      hexToRgb(theme.palette.primary.main)[1]
                    }, ${hexToRgb(theme.palette.primary.main)[2]}, 0.1)`,
                    color: theme.palette.grey[900],
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // cursor: 'pointer',
                      gap: '5px',
                    }}
                  >
                    {headCell.label}
                  </Box>
                </TableCell>
              ))}
            </TableHead>

            <TableBody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <AreaTableRow
                  key={row.id}
                  row={row}
                  selected={selected.includes(row.id)}
                  onSelectRow={() => onSelectRow(row.id)}
                  // onViewRow={() => handleViewRow(row.id)}
                  // onEditRow={() => handleEditRow(row.id)}
                  // onDeleteRow={() => handleDeleteRow(row.id)}
                />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, products.length)}
              />
            </TableBody>
          </Table>

          <Stack
            spacing={1}
            sx={{
              mt: 2,
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <LoadingButton
              type="button"
              color="inherit"
              onClick={() => push(PATH_DASHBOARD.area.map)}
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{
                width: '200px',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Avançar
            </LoadingButton>
          </Stack>
        </TableContainer>
      </Scrollbar>
    </FormProvider>
  );
}

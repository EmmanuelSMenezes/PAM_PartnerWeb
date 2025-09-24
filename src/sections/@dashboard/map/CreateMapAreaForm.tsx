import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Stack, Table, TableHead, TableCell, Box, TableBody, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Scrollbar from 'src/components/scrollbar';
import { TableEmptyRows, emptyRows, useTable } from 'src/components/table';
import products from 'src/@types/products';
import AreaTableRow from 'src/pages/dashboard/area/actuation/components/AreaTableRow';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { hexToRgb } from 'src/utils/hexToRgb';
import { IBlogNewPost } from '../../../@types/blog';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

const TABLE_HEAD = [{ id: 'createDate', label: 'Endereço de Atuação', align: 'center' }];

export type FormValuesProps = IBlogNewPost; // passar os campos corretos

export default function CreateMapAreaForm() {
  const { dense, page, rowsPerPage, selected, onSelectRow } = useTable({
    defaultOrderBy: 'createDate',
  });

  const { push } = useRouter();
  const theme = useTheme();

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
      <Stack spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
        <Typography variant="body2">
          Selecione abaixo o endereço de atuação correspondente a nova área.
        </Typography>
      </Stack>

      <Scrollbar>
        <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800, mt: 2 }}>
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
      </Scrollbar>

      <LoadingButton
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Avançar
      </LoadingButton>
    </FormProvider>
  );
}

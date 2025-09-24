import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import * as Yup from 'yup';
import {
  Autocomplete,
  Card,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFRadioGroup, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { coinToNumber, numberToCoin } from 'src/utils/formatCurrency';
import { LoadingButton } from '@mui/lab';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/useAuthContext';
import { CustomFile } from 'src/components/upload';
import { iCategory } from 'src/@types/category';
import { category } from 'src/service/category';
import { postProductImage, postProductService } from 'src/service/productService';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

EcommerceProductCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const ITEM_OPTION = [
  { label: 'Produto', value: 'p' },
  { label: 'Serviço', value: 's' },
];

interface FormValuesProps {
  name: string;
  option: string;
  description: string;
  category: any;
  subcategory: string;
  lowestPrice: number | string;
  additionalInformation: string;
  images: CustomFile | File | string;
}

const categoryDefaultValue = {
  category_id: '',
  identifier: 0,
  description: '',
  category_parent_name: '',
  category_parent_id: '',
  created_by: '',
  updated_by: '',
  created_at: '',
  updated_at: '',
  active: true,
};

const defaultValuesCategory = {
  option: '',
  name: '',
  description: '',
  category: '',
  lowestPrice: '',
  images: undefined,
  additionalInformation: '',
};

export default function EcommerceProductCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { push } = useRouter();
  const router = useRouter();
  const [categories, setCategories] = useState<iCategory[]>([categoryDefaultValue]);
  const [selectedCategories, setSelectedCategories] = useState<iCategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<iCategory[]>([]);
  const [subcategories, setSubcategories] = useState<iCategory[]>([categoryDefaultValue]);
  const [price, setPrice] = useState('');
  const { user } = useAuthContext();
  const [file, setFile] = useState<any>(undefined);

  const storedPartnerId = localStorage.getItem('partnerId');
  const parsedPartnerId = storedPartnerId !== null ? JSON.parse(storedPartnerId) : null;

  const NewProductSchema = Yup.object().shape({
    option: Yup.string().required('Selecione o tipo de item'),
    name: Yup.string().required('Nome é obrigatório'),
    description: Yup.string().required('Descrição é obrigatória'),
    lowestPrice: Yup.number().required('Preço mínimo é obrigatório'),
    category: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().required('Selecione pelo menos uma categoria'),
        })
      )
      .min(1, 'Selecione pelo menos uma categoria'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues: defaultValuesCategory,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const getCategories = async () => {
    try {
      const response: any = await category({ filter: '', itensPerPage: 9999, page: 0 });
      const filterCategories = response.categories
        .filter((obj: iCategory) => obj.category_parent_id === null)
        .filter((element: any) => element.active !== false);
      const filterSubcategories = response.categories
        .filter((obj: iCategory) => obj.category_parent_id !== null)
        .filter((element: any) => element.active !== false);

      setCategories(filterCategories);
      setSubcategories(filterSubcategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const concatCategories = selectedCategories?.concat(selectedSubCategories);
    const categoriesArray: any = [];
    concatCategories.forEach((value: any) => {
      categoriesArray.push({
        category_id: value.category_id,
        category_parent_id: value.category_parent_id,
      });
    });

    try {
      const newProduct = await postProductService({
        type: data.option,
        name: data.name,
        description: data.description,
        categoryGroup: categoriesArray,
        minimum_price: price,
        note: data.additionalInformation,
        created_by: user?.user_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : parsedPartnerId?.admin_id,
      });
      await postProductImage({ Image: file, product_id: newProduct.product.product_id });
      enqueueSnackbar('Produto/Serviço cadastrado com sucesso!', { variant: 'success' });
      reset();
      setSelectedCategories([]);
      setSelectedSubCategories([]);
      setPrice('');
      setFile(undefined);
      push(PATH_DASHBOARD.catalog.list);
    } catch (error) {
      enqueueSnackbar('Não foi possivel cadastrar. Verifique os campos e tente novamente!', {
        variant: 'error',
      });
    }
  };

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const fileImage = acceptedFiles[0];
    if (fileImage) {
      setFile(
        Object.assign(fileImage, {
          preview: URL.createObjectURL(fileImage),
        })
      );
    }
    setValue('images', fileImage);
  }, []);

  const verifyDisabledCategory = useCallback(
    (category_id: string) =>
      selectedCategories
        ?.map((selectedCategory) => selectedCategory.category_id)
        ?.includes(category_id),
    [selectedCategories]
  );

  const filterSubCategoriesBasedOnSelectedCategories = useCallback(
    (category_parent_id: string) =>
      category_parent_id !== null && verifyDisabledCategory(category_parent_id),
    [verifyDisabledCategory]
  );

  const SubCategoriesAutoComplete = useCallback(
    () => (
      <Autocomplete
        multiple
        id="tags"
        options={subcategories.filter((filteredCategory: iCategory) =>
          filterSubCategoriesBasedOnSelectedCategories(filteredCategory.category_parent_id)
        )}
        getOptionLabel={(option: any) => option.description}
        defaultValue={[]}
        value={selectedSubCategories}
        onChange={(_e: SyntheticEvent<Element, Event>, elementsSubcategories: any[]) => {
          subcategories.forEach((subCategoryExisting) => {
            if (
              subCategoryExisting.description ===
                elementsSubcategories[elementsSubcategories.length - 1]?.description ||
              elementsSubcategories.length === 0
            ) {
              setSelectedSubCategories(elementsSubcategories);
            }
          });
        }}
        freeSolo
        // eslint-disable-next-line @typescript-eslint/no-shadow
        renderTags={(elementsSubcategories: readonly iCategory[], getTagProps) =>
          elementsSubcategories.map((option: iCategory, index: number) => (
            <Chip variant="outlined" label={option.description} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Subcategorias:"
            // placeholder="Subcategorias"
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    ),
    [selectedCategories, selectedSubCategories, setSelectedCategories, setSelectedSubCategories]
  );

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <>
        <Head>
          <title>Parceiro | Criação de Novo Produto/Serviço</title>
        </Head>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Novo Produto/Serviço"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Produtos e serviços', href: PATH_DASHBOARD.catalog.list },
              { name: 'Novo Produto/Serviço' },
            ]}
          />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFRadioGroup row spacing={4} name="option" options={ITEM_OPTION} />
                  <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
                    <RHFTextField name="name" InputLabelProps={{ shrink: true }} label="*Nome:" />
                  </Stack>

                  <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
                    <Stack sx={{ width: '100%' }} spacing={1}>
                      <RHFTextField
                        multiline
                        rows={5}
                        label="*Descrição:"
                        name="description"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Stack>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        id="tags-filled"
                        options={categories}
                        getOptionLabel={(option: any) => option.description}
                        defaultValue={[]}
                        value={selectedCategories}
                        onChange={(
                          _e: SyntheticEvent<Element, Event>,
                          elementsCategories: any[]
                        ) => {
                          if (elementsCategories.length < selectedCategories?.length) {
                            setSelectedSubCategories(
                              selectedSubCategories?.filter((value) =>
                                elementsCategories
                                  .map((element: any) => element.category_id)
                                  .includes(value.category_parent_id)
                              )
                            );
                          }
                          categories.forEach((categoryExisting) => {
                            if (
                              categoryExisting.description ===
                                elementsCategories[elementsCategories.length - 1]?.description ||
                              elementsCategories.length === 0
                            ) {
                              setSelectedCategories(elementsCategories);
                              setValue('category', elementsCategories);
                            }
                          });
                        }}
                        freeSolo
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        renderTags={(element: readonly iCategory[], getTagProps) =>
                          element.map((option: iCategory, index: number) => (
                            <Chip
                              variant="outlined"
                              label={option.description}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputRef={ref}
                            name="category"
                            label="*Categorias:"
                            InputLabelProps={{ shrink: true }}
                            // placeholder="Escolha uma categoria"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <SubCategoriesAutoComplete />
                  {/* <Stack>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      *Deseja acrescentar taxa de serviço:
                    </Typography>

                    <RHFRadioGroup row spacing={4} name="option" options={FEE_OPTION} />
                  </Stack> */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      name="lowestPrice"
                      label="*Preço mínimo:"
                      InputLabelProps={{ shrink: true }}
                      value={`R$ ${numberToCoin(price)}`}
                      onChange={(e) => {
                        setValue('lowestPrice', coinToNumber(e.target.value));
                        setPrice(coinToNumber(e.target.value));
                      }}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      *Imagem sugerida do item:
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <RHFUpload
                        name="images"
                        files={file}
                        error={!!errors.images}
                        helperText={errors.images?.message}
                        onDrop={handleDropSingleFile}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      InputLabelProps={{ shrink: true }}
                      name="additionalInformation"
                      label="Informações adicionais ou observações:"
                    />
                  </Stack>
                </Stack>
              </Card>

              <Stack
                spacing={1}
                sx={{
                  mt: 1,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <LoadingButton
                  // size="large"
                  color="inherit"
                  type="button"
                  variant="contained"
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
                  disabled={
                    watch('name') === '' ||
                    watch('option') === '' ||
                    watch('description') === '' ||
                    watch('lowestPrice') === '' ||
                    file === undefined ||
                    selectedCategories.length === 0
                  }
                  variant="contained"
                  // size="large"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                    },
                  }}
                  loading={isSubmitting}
                >
                  Criar Novo
                </LoadingButton>
              </Stack>
            </Grid>
          </FormProvider>
        </Container>
      </>
    </Container>
  );
}

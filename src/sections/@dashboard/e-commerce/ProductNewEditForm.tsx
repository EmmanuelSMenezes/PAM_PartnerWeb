import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, FormHelperText, Chip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getCreateImage, getProductUpdate } from 'src/service/product';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'notistack';
import ModalReview from 'src/pages/dashboard/catalog/products/[id]/components/ModalReview';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { CustomFile } from 'src/components/upload';
import { coinToNumber, numberToCoin } from 'src/utils/formatCurrency';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { calculateFee, discountFee } from 'src/utils/formatNumber';
import { IProduct } from '../../../@types/product';
import FormProvider, { RHFUpload, RHFTextField } from '../../../components/hook-form';

const FEE_OPTION = [
  { label: 'Pagar Taxa', value: 'chargeFee' },
  { label: 'Repassar a taxa', value: 'receiveFee' },
];

interface FormValuesProps {
  reviewer: boolean;
  image_default: string;
  name: string;
  description: string;
  category: any;
  price: number;
  extraInfos: string;
  images: CustomFile[];
  tags: any[];
  note: string;
  minimum_price: number;
  sale_price: number;
  selectedFee: string;
}

type Props = {
  isEdit?: boolean;
  currentProduct?: IProduct;
  isActiving?: boolean;
};

interface ImageInfo {
  preview: string;
  path: string;
}

export default function ProductNewEditForm({ isEdit, currentProduct, isActiving }: Props) {
  const theme = useTheme();
  const { user, partnerId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { setIsActiving } = useGlobalContext();
  const { push } = useRouter();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState<FormValuesProps | null>(null);
  const [file, setFile] = useState<CustomFile[] | undefined>([]);
  const [firstImage, setFirstImage] = useState<any>();
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorImage, setErrorImage] = useState(false);
  const [selectedFee, setSelectedFee] = useState('chargeFee');
  const [firstSelectedFee, setFirstSelectedFee] = useState('');
  const [salePrice, setSalePrice] = useState<any>('');
  const [editablePrice, setEditablePrice] = useState();

  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const storedPartnerId = localStorage.getItem('partnerId');
  const parsedPartnerId = storedPartnerId !== null ? JSON.parse(storedPartnerId) : null;

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('O nome do item é um campo obrigatório.'),
    images: Yup.array().min(1, 'O envio da imagem é obrigatório.'),
    sale_price: Yup.number(),
    minimum_price: Yup.number(),
    price: Yup.number()
      .required('O preço é um campo obrigatório.')
      .moreThan(0, 'O valor atualizado deve ser igual ou maior que o valor mínimo')
      .min(
        Yup.ref('minimum_price'),
        'O valor atualizado deve ser igual ou maior que o valor mínimo'
      ),
    description: Yup.string().required('A descrição do item é obrigatória.'),
    note: Yup.string(),
  });

  const defaultValues = {
    name: currentProduct?.name || '',
    description: currentProduct?.description || '',
    images: [],
    sale_price: currentProduct?.sale_price || 0,
    price: currentProduct?.price || 0,
    category: '',
    tags: [] || '',
    extraInfos: currentProduct?.extraInfos || '',
    note: currentProduct?.note || '',
    minimum_price: currentProduct?.minimum_price || 0,
  };

  const handleOptionClick = (option: any) => {
    setSelectedFee(option.value);
    setValue('selectedFee', option.value);
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  useEffect(() => {
    if (currentProduct && currentProduct?.sale_price > currentProduct?.price) {
      setSelectedFee('receiveFee');
      setFirstSelectedFee('receiveFee');
      setSalePrice(calculateSalePrice);
      setEditablePrice(price);
    } else {
      setSelectedFee('chargeFee');
      setFirstSelectedFee('chargeFee');
      setSalePrice(price);
      setEditablePrice(price);
    }
  }, [currentProduct, salePrice, editablePrice]);

  const onSubmit = async () => {
    if (isEdit) {
      handleClickOpen();
    } else {
      onFinalSubmit();
    }
  };

  const onFinalSubmit = async () => {
    const data = getValues();

    const item = {
      product_id: currentProduct?.product_id,
      name: data.name,
      description: data.description,
      price: data.price,
      sale_price: selectedFee === 'chargeFee' ? data.price : calculateSalePrice,
      active: isActiving ? !currentProduct?.active : currentProduct?.active,
      updated_by: userId,
      reviewer: false,
    };

    try {
      await getProductUpdate(item);
      await onSubmitImage();
      enqueueSnackbar(
        !isEdit
          ? 'Serviço ou produto cadastrado com sucesso'
          : 'Serviço ou produto atualizado com sucesso!'
      );
      push(PATH_DASHBOARD.catalog.productsList);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível cadastrar serviço ou produto', { variant: 'error' });
    } finally {
      setIsActiving(false);
    }
  };

  const onSubmitImage = async () => {
    const data = getValues();

    try {
      await getCreateImage({
        product_id: currentProduct?.product_id,
        partner_id: partnerId?.partner_id,
        imagedefaultname: data?.images[0].name,
        images: data?.images,
      });

      const uploadedImages = data.images;
      const updatedImages = [...(file || []), ...uploadedImages];
      setFile(updatedImages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentProduct?.images) {
      const existingImages: ImageInfo[] = currentProduct?.images?.map((image) => ({
        preview: image?.url,
        path: image?.url,
      }));
      setFile(existingImages as CustomFile[]);
      setFirstImage(existingImages[0]?.preview);
    }
  }, [currentProduct]);

  const handleClickOpen = async () => {
    setOpenModal(true);
    const data = getValues();
    setFormValues(data);
  };

  useEffect(() => {
    const data = getValues();
    setFormValues(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];
      const newFiles = acceptedFiles.map((acceptedFile) =>
        Object.assign(acceptedFile, {
          preview: URL.createObjectURL(acceptedFile),
        })
      );

      if (!file) {
        setFile(newFiles);
      }
      newFiles.forEach((value) => {
        file?.push(value);
      });
      setValue('images', [...files, ...newFiles], { shouldValidate: true });
      if (!firstImage) {
        setFirstImage(newFiles[0].preview);
      }
      setValue('images', [...files, ...newFiles]);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, values.images]
  );

  useEffect(() => {
    if (currentProduct?.images !== undefined && currentProduct?.images?.length > 0) {
      let dataFile: any = new File(
        [currentProduct?.images[0]?.url],
        currentProduct?.images[0]?.url,
        {
          type: 'image/jpeg',
        }
      );
      dataFile = Object.assign(dataFile, {
        preview: currentProduct?.images[0]?.url,
        path: currentProduct?.images[0]?.url,
      });
      file?.push(dataFile);
      if (file !== undefined) {
        setValue('images', [...file]);
      }
      setFirstImage(dataFile?.preview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct]);

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered: any = values.images && values.images?.filter((image) => image !== inputFile);
    setValue('images', filtered);
    setFile(filtered);
    setFirstImage(filtered[0]?.preview);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  useEffect(() => {
    if (isActiving) {
      if (values.price === 0) {
        setErrorPrice(true);
      } else {
        setErrorPrice(false);
      }
      if (values.images.length === 0) {
        setErrorImage(true);
      } else {
        setErrorImage(false);
      }
    }
  }, [values]);

  const price: any = Number(watch('price'));
  const serviceFee: any = parsedPartnerId?.service_fee;
  const cardFee: any = parsedPartnerId?.card_fee;
  const totalFee: any = (serviceFee + cardFee).toFixed(2);

  const totalValue: any = price * totalFee;

  const calculateSalePrice = calculateFee(price, totalFee);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Controller
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    disabled
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="*Nome do Serviço/Produto:"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <Stack spacing={1}>
                <Stack sx={{ width: '100%' }} spacing={1}>
                  <RHFTextField
                    multiline
                    rows={5}
                    label="*Descrição:"
                    name="description"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Stack>{' '}
              </Stack>
              <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <RHFTextField
                  name="minimum_price"
                  disabled
                  label="Preço mínimo:"
                  placeholder=""
                  value={`R$ ${numberToCoin(getValues('minimum_price').toString())}`}
                  onChange={(e) =>
                    setValue('minimum_price', parseFloat(coinToNumber(e.target.value)))
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <Controller
                  control={methods.control}
                  name="sale_price"
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      disabled
                      name="sale_price"
                      label="Preço de Venda:"
                      value={`R$ ${numberToCoin(getValues('sale_price').toString())}`}
                      // onChange={(e) => field.onChange(parseFloat(coinToNumber(e.target.value)))}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />

                <Controller
                  control={methods.control}
                  name="price"
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label="Preço Final:"
                      value={`R$ ${numberToCoin(field.value.toString())}`}
                      onChange={(e) => field.onChange(parseFloat(coinToNumber(e.target.value)))}
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errorPrice ? 'O valor atualizado deve ser diferente de zero.' : ''
                      }
                      error={errorPrice}
                      sx={{
                        '& fieldset.MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.price ? '#ff5330' : '',
                        },
                      }}
                      FormHelperTextProps={{ style: { color: '#ff5330' } }}
                    />
                  )}
                />
              </Stack>

              <Stack
                direction={{ sm: 'column' }}
                spacing={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  // border: '1px solid purple',
                }}
              >
                <Stack spacing={1} direction={{ sm: 'row' }} sx={{ width: '100%' }}>
                  {FEE_OPTION.map((optionFee) => (
                    <>
                      {optionFee.label === 'Repassar a taxa' ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            alignItems: 'center',
                            height: '60px',
                          }}
                        >
                          <Chip
                            key={optionFee.value}
                            sx={{ borderRadius: '5px', width: '100%' }}
                            label={optionFee.label}
                            onClick={() => handleOptionClick(optionFee)}
                            color={selectedFee === optionFee.value ? 'primary' : 'default'}
                            clickable
                          />
                          {selectedFee === optionFee.value && (
                            <Typography variant="caption" sx={{ color: '#be5028', mt: '5px' }}>
                              Ao selecionar essa opção, o valor do produto será igual ao preço de
                              venda.
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Chip
                          key={optionFee.value}
                          sx={{ borderRadius: '5px', width: '100%' }}
                          label={optionFee.label}
                          onClick={() => handleOptionClick(optionFee)}
                          color={selectedFee === optionFee.value ? 'primary' : 'default'}
                          clickable
                        />
                      )}
                    </>
                  ))}
                </Stack>

                <Stack
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    width: '30%',
                    // border: '1px solid blue',
                    alignItems: 'center',
                  }}
                >
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    {selectedFee !== null && selectedFee === 'receiveFee' ? (
                      <>
                        <Stack>
                          <Typography variant="body1">Preço de Venda:</Typography>
                          <Typography variant="caption" sx={{ color: '#637381' }}>
                            Seu cliente paga
                          </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          R$ {calculateFee(price, totalFee).replace('.', ',')}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Stack>
                          <Typography variant="body1">Preço de Venda:</Typography>
                          <Typography variant="caption" sx={{ color: '#637381' }}>
                            Seu cliente paga
                          </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          R$ {price.toFixed(2).replace('.', ',')}
                        </Typography>
                      </>
                    )}
                  </Stack>

                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Typography variant="body1">Total de taxas:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      R$ {numberToCoin(totalValue)} ({(totalFee * 100).toFixed(0)}%)
                    </Typography>
                  </Stack>

                  <Stack
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      Você recebe:
                    </Typography>

                    <Stack sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#008000' }}>
                        R${' '}
                        {selectedFee === 'receiveFee'
                          ? price.toFixed(2).replace('.', ',')
                          : discountFee(price, totalFee).replace('.', ',')}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#637381' }}>
                        Valor líquido
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Selecione uma imagem:
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  files={file}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.log('ON UPLOAD')}
                  helperText={
                    !!errorImage && (
                      <FormHelperText error={!!errorImage}>
                        O envio da imagem é obrigatório.
                      </FormHelperText>
                    )
                  }
                  error={errorImage}
                />
              </Stack>
            </Stack>
          </Card>
          <Stack
            spacing={1}
            sx={{
              mt: 2,
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
              color="inherit"
              variant="contained"
              // size="large"
              loading={isSubmitting}
              disabled={
                watch('description') === currentProduct?.description &&
                watch('price') === currentProduct?.price &&
                watch('images')[0]?.preview === currentProduct?.images[0]?.url &&
                watch('images').length === currentProduct?.images?.length &&
                selectedFee === firstSelectedFee
              }
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              {!isEdit ? 'Criar Item' : 'Salvar alterações'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

      {openModal && (
        <ModalReview
          handleClose={handleClose}
          onSubmit={onFinalSubmit}
          open={openModal}
          currentProduct={currentProduct}
          formValues={formValues}
          image={firstImage}
        />
      )}
    </FormProvider>
  );
}

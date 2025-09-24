/* eslint-disable eqeqeq */
import { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
  FormHelperText,
  Button,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Head from 'next/head';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { useRouter } from 'next/router';
import { areaShippingCreate, getPayment, getValueMinimum } from 'src/service/billing';
import { weekdayToNumber } from 'src/utils/weekdaysFormat';
import { weekdayToName } from 'src/utils/weekdayToName';
import { areaDelivery, getAreaConfigById, updateAreaConfig } from 'src/service/area';
import { IAreaConfigById, IAreaDelivery, PaymentOption } from 'src/@types/area';
import { useSnackbar } from 'notistack';
import { getBankAccount } from 'src/service/partner';
import { IBankAccount } from 'src/@types/partner';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { coinToNumber, numberToCoin } from 'src/utils/formatCurrency';

AreaConfig.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface FormValuesProps {
  freteGratis: any;
  daysError: any;
  weekdays: string;
  initialTime: string;
  minimalPrice: string;
  finalTime: string;
  deliveryOptions: string[];
  meioPagamento: PaymentOption[];
  afterSubmit?: string;
  freteTarifado: number;
  messageError: any;
}

interface IPaymentList {
  payment_local_name: string;
  active: boolean;
  payment_local_id: string;
}

const daysOfWeekOptions = [
  { value: 'domingo', label: 'Domingo', id: '1' },
  { value: 'segunda-feira', label: 'Segunda-feira', id: '2' },
  { value: 'terça-feira', label: 'Terça-feira', id: '3' },
  { value: 'quarta-feira', label: 'Quarta-feira', id: '4' },
  { value: 'quinta-feira', label: 'Quinta-feira', id: '5' },
  { value: 'sexta-feira', label: 'Sexta-feira', id: '6' },
  { value: 'sábado', label: 'Sábado', id: '7' },
];

export default function AreaConfig() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { setActiveTab, activeTab } = useGlobalContext();
  const router = useRouter();
  const { push } = useRouter();
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [deliveryList, setDeliveryList] = useState<IAreaDelivery[]>([]);
  const [expandedOptions, setExpandedOptions] = useState<string[]>([]);
  const [expandedOptionsPayment, setExpandedOptionsPayment] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [configList, setConfigList] = useState<IAreaConfigById>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<any>({});
  const [selectedShippingOptions, setSelectedShippingOptions] = useState<any>({});
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState<any>({});
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDaysOptions, setSelectedDaysOptions] = useState<any>({});
  const [weekdayStorage, setWeekDaysStorage] = useState<any>([]);
  const [selectedShippingCheck, setSelectedShippingCheck] = useState(false);
  const [shippingValue, setShippingValue] = useState<any>({});
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [bankAccount, setBankAccount] = useState<IBankAccount>();
  const [minValue, setMinValue] = useState<any>();
  const [minStandardValue, setMinStandardValue] = useState<any>();
  const [pagId, setPagId] = useState<string>('');

  const storedPartnerId = localStorage.getItem('partnerId');
  const parsedPartnerId = storedPartnerId !== null ? JSON.parse(storedPartnerId) : '';

  const handleRedirectToBankAccount = () => {
    if (activeTab !== 'bank_account') {
      setActiveTab('bank_account');
    }
    push(PATH_DASHBOARD.user.account);
  };

  const {
    query: { id },
  } = useRouter();

  const areaId: any = id;

  const NewActuationSchema = Yup.object().shape({
    initialTime: Yup.string().required('Horário inicial é obrigatório'),
    minimalPrice: Yup.string()
      .required('Preço mínimo é obrigatório')
      .test(
        'is-greater-than-standard',
        'O preço mínimo deve ser maior que R$8,00',
        (value) => minValue >= minStandardValue
      ),
    finalTime: Yup.string()
      .required('Horário final é obrigatório')
      .test(
        'is-greater-than-initial',
        'Horário final deve ser maior que o inicial',
        function (value) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { initialTime } = this.parent;

          const timeToMinutes = (timeString: any) => {
            const [hours, minutes] = timeString.split(':');
            return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
          };

          const initialMinutes = timeToMinutes(initialTime);
          const finalMinutes = timeToMinutes(value);

          return finalMinutes > initialMinutes;
        }
      ),
    deliveryOptions: Yup.array()
      .required('Opções de entrega são obrigatórias')
      .min(1, 'Selecione pelo menos uma opção de entrega')
      .of(Yup.string()),

    meioPagamento: Yup.array()
      .required('Selecione um meio de pagamento')
      .min(1, 'Selecione um meio de pagamento')
      .of(Yup.string()),
  });

  const defaultValues = {
    weekdays: '',
    minimalPrice: minStandardValue || '',
    initialTime: configList?.start_hour || '',
    finalTime: configList?.end_hour || '',
    deliveryOptions:
      configList?.shipping_options.map((shipping) => shipping.delivery_option_id) || [],
    meioPagamento: configList?.payment_options || [],
    freteGratis: !configList?.shipping_options.some((shipping) => shipping.shipping_free) || true,
  };

  useEffect(() => {
    if (configList) {
      const updateValues = {
        weekdays:
          configList.working_days.map((workingDay: any) => weekdayToName(workingDay.day_number)) ||
          '',
        minimalPrice: minStandardValue || '',
        initialTime: configList.start_hour || '',
        finalTime: configList.end_hour || '',
        deliveryOptions:
          configList.shipping_options.map((shipping) => shipping.delivery_option_id) || [],
        meioPagamento:
          configList.payment_options.map((payment: any) => payment.payment_options_id) || [],
      };

      setValue('initialTime', updateValues.initialTime);
      setValue('finalTime', updateValues.finalTime);
      setValue('deliveryOptions', updateValues.deliveryOptions);
      setValue('meioPagamento', updateValues.meioPagamento);
      setValue('minimalPrice', updateValues.minimalPrice);
      setSelectedDaysOfWeek(updateValues.weekdays);
    }
  }, [configList]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewActuationSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const handleDeliveryOptionChange = (event: any, value: any, field: any) => {
    const selectedOptionsList = [...(field.value ?? [])];

    const expanded = expandedOptions.includes(value);

    if (event?.target.checked) {
      if (!expanded) {
        selectedOptionsList.push(value);
        setExpandedOptions((prevOptions) => [...prevOptions, value]);
      }
    } else {
      const index = selectedOptionsList.indexOf(value);
      if (index !== -1) {
        selectedOptionsList.splice(index, 1);
      }

      if (expanded) {
        setExpandedOptions((prevOptions) => prevOptions.filter((option) => option !== value));
      }
    }

    field.onChange(selectedOptionsList);

    setSelectedDelivery(selectedOptionsList);
  };

  const handlePaymentOption = (event: any, value: any, field: any) => {
    const selectedOptionsList = [...(field.value ?? [])];

    const expanded = expandedOptionsPayment.includes(value);

    if (event?.target.checked) {
      if (!expanded) {
        selectedOptionsList.push(value);
        setExpandedOptionsPayment((prevOptions) => [...prevOptions, value]);
      }
    } else {
      const index = selectedOptionsList.indexOf(value);
      if (index !== -1) {
        selectedOptionsList.splice(index, 1);
      }

      if (expanded) {
        setExpandedOptionsPayment((prevOptions) =>
          prevOptions.filter((option) => option !== value)
        );
      }
    }

    field.onChange(selectedOptionsList);

    setSelectedPayments(selectedOptionsList);
  };

  const handleDaysOptions = async (event: any) => {
    const daysToIndex: any = [];
    const orderedDays: any = [];

    event.target.value.forEach((day: any) => {
      daysToIndex.push(weekdayToNumber(day));
    });

    daysToIndex.sort().forEach((indexDay: any) => {
      orderedDays.push(weekdayToName(indexDay));
    });

    setSelectedDaysOfWeek(orderedDays);

    setSelectedDays([]);

    event.target.value.forEach((dayName: any) => {
      const weekdayFiltered = weekdayStorage.filter(
        // eslint-disable-next-line eqeqeq
        (weekdays: any) => weekdays.day_number == weekdayToNumber(dayName)
      );

      if (weekdayFiltered.length > 0) {
        const index = weekdayStorage.findIndex(
          // eslint-disable-next-line eqeqeq
          (value: any) => value.day_number == weekdayToNumber(dayName)
        );
        setDaysWeek(dayName, weekdayStorage[index]?.working_day_id);
      } else {
        setDaysWeek(dayName, null);
      }
    });

    setSelectedDaysOptions(event.target.value);
  };

  const getPaymentMethods = async () => {
    try {
      const response = await getPayment({ page: 1, itensPerPage: 100 });
      setPaymentMethods(response.payments);
    } catch (error) {
      console.log(error);
    }
  };

  const getAreaConfigId = async () => {
    try {
      const response = await getAreaConfigById(areaId);
      setConfigList(response);
      setIsEdit(true);
      response.shipping_options.forEach((ship) => {
        if (ship.shipping_free) {
          setFreeShipment(
            ship.delivery_option_id,
            ship.shipping_free,
            ship.actuation_area_shipping_id
          );
        } else {
          setPaidShipment(ship.delivery_option_id, true, ship.actuation_area_shipping_id);
          setValueShipping(ship.delivery_option_id, ship.value);
        }

        setSelectedDelivery((old) => [...old, ship.delivery_option_id]);
      });
      response.payment_options.forEach((payment) => {
        setPaymentsId(payment.payment_options_id, payment?.actuation_area_payments_id);
        setSelectedPayments((old) => [...old, payment.payment_options_id]);
      });
      response.working_days.forEach((day: any) => {
        setDaysWeek(weekdayToName(day.day_number), day.working_day_id);

        setWeekDaysStorage((old: any) => [
          ...old,
          { working_day_id: day.working_day_id, day_number: day.day_number },
        ]);
      });
    } catch (error) {
      setIsEdit(false);
      console.log(error);
    }
  };

  const getMinValue = async () => {
    try {
      const response = await getValueMinimum(parsedPartnerId.partner_id);
      setMinValue(response.value_minimum);
      setPagId(response.pagseguro_value_minimum_id);
      setMinStandardValue(response.value_minimum_standard);
    } catch (error) {
      console.log(error);
    }
  };

  const [isErrorSelectDays, setIsSelectErrorDays] = useState<any>('');

  // eslint-disable-next-line consistent-return
  const onSubmit = async (data: FormValuesProps) => {
    if (selectedDaysOfWeek.length === 0) {
      return setIsSelectErrorDays({
        message: 'Selecione um dia de funcionamento',
      });
    }
    const days = selectedDaysOfWeek.map(weekdayToNumber);
    setMessageError({});
    const arrayErrors = [];

    if (selectedDelivery.length === 0 && selectedPayments.length === 0) {
      return enqueueSnackbar('Selecione uma opção de entrega e um meio de pagamento', {
        variant: 'error',
      });
    }

    if (selectedPayments.length === 0) {
      return enqueueSnackbar('Selecione um meio de pagamento', { variant: 'error' });
    }

    if (selectedDelivery.length === 0) {
      return enqueueSnackbar('Selecione uma opção de entrega', { variant: 'error' });
    }

    deliveryList.forEach((optionId) => {
      if (shippingValue[optionId.delivery_option_id]) {
        if (
          shippingValue[optionId.delivery_option_id].value == '' ||
          shippingValue[optionId.delivery_option_id].value == 0
        ) {
          arrayErrors.push(optionId.delivery_option_id);
          setErrorMessage(optionId.delivery_option_id);
        }
      }
    });

    if (arrayErrors.length > 0) {
      return null;
    }

    const createParams = {
      actuation_area_id: areaId,
      start_hour: data.initialTime,
      end_hour: data.finalTime,
      working_day: days,
      payment: selectedPayments,
      shipping_options: selectedDelivery?.map((optionId) => ({
        shipping_free: selectedShippingOptions[optionId]?.freteGratis || false,
        delivery_options_id: optionId,
        value: +shippingValue[optionId]?.value || 0,
      })),
    };
    // @ts-ignore
    const uniqueSelectedPayments = [...new Set(selectedPayments)];
    // @ts-ignore
    const uniqueSelectedDelivery = [...new Set(selectedDelivery)];

    const updateParams = {
      actuation_area_config_id: configList?.actuation_area_config_id,
      actuation_area_id: areaId,
      start_hour: data.initialTime,
      value_minimum: +minValue,
      payment_local_id: paymentLocalId,
      pagseguro_value_minimum_id: pagId,
      end_hour: data.finalTime,
      working_day: selectedDays.map((day: any) => ({
        working_day_id: day.working_day_id,
        day_number: weekdayToNumber(day.day_number),
      })),
      payment: uniqueSelectedPayments.map((optionId) => ({
        actuation_area_payments_id: selectedPaymentOptions[optionId].actuation_area_payments_id,
        payment_options_id: selectedPaymentOptions[optionId].selectedPayments,
      })),
      shipping_options: uniqueSelectedDelivery.map((optionId) => ({
        actuation_area_shipping_id:
          selectedShippingOptions[optionId]?.actuation_area_shipping_id || null,
        shipping_free: selectedShippingOptions[optionId]?.freteGratis || false,
        delivery_option_id: optionId,
        value: +shippingValue[optionId]?.value || 0,
      })),
    };
    try {
      if (isEdit) {
        await updateAreaConfig(updateParams);
        enqueueSnackbar('Configurações da área atualizadas com sucesso');
        push(PATH_DASHBOARD.area.areaList);
      } else {
        await areaShippingCreate(createParams);
        enqueueSnackbar('Configurações da área criadas com sucesso.');
        push(PATH_DASHBOARD.area.areaList);
      }
      setIsFormDirty(false);
    } catch (error) {
      enqueueSnackbar(
        isEdit
          ? 'Não foi possível atualizar as configurações'
          : 'Não foi possível adicionar as atualizações',
        { variant: 'error' }
      );
      console.log(error);
    }
  };

  const getDeliveryOptions = async () => {
    try {
      const response = await areaDelivery();
      setDeliveryList(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getBankAccountData = async () => {
    try {
      const response = await getBankAccount(parsedPartnerId?.partner_id);
      setBankAccount(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPaymentMethods();
    getDeliveryOptions();
    getAreaConfigId();
    getBankAccountData();
    getMinValue();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAreaConfigId();
  }, [areaId]);

  useEffect(
    () => setValue('weekdays', selectedDaysOfWeek.join(', ')),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const setErrorMessage = (optionId: any) => {
    setMessageError((value: any) => ({
      ...value,
      [optionId]: {
        ...value[optionId],
        id: optionId,
        message: 'Campo obrigatório',
      },
    }));
  };

  const setPaidShipment = (optionId: any, value: any, actuationId?: any) => {
    setSelectedShippingOptions((prevOptions: any) => ({
      ...prevOptions,
      [optionId]: {
        ...prevOptions[optionId],
        freteTarifado: value,
        actuation_area_shipping_id: actuationId,
      },
    }));
  };

  const setFreeShipment = (optionId: any, value: any, actuationId?: any) => {
    setSelectedShippingOptions((prevOptions: any) => ({
      ...prevOptions,
      [optionId]: {
        ...prevOptions[optionId],
        freteGratis: value,
        actuation_area_shipping_id: actuationId,
      },
    }));
  };

  const setValueShipping = (optionId: any, value: any) => {
    setShippingValue((prevOptions: any) => ({
      ...prevOptions,
      [optionId]: {
        ...prevOptions[optionId],
        optionId,
        value,
      },
    }));
  };

  const setPaymentsId = (optionId: any, value: any) => {
    setSelectedPaymentOptions((prevOptions: any) => ({
      ...prevOptions,
      [optionId]: {
        ...prevOptions[optionId],
        actuation_area_payments_id: value,
        selectedPayments: optionId,
      },
    }));
  };

  const setDaysWeek = (optionId: any, working_day_id?: any) => {
    setSelectedDays((prevOptions: any) => [
      ...prevOptions,
      {
        working_day_id,
        day_number: optionId,
      },
    ]);
  };

  const handleChangeCheckbox = (event: any) => {
    setSelectedShippingCheck((prevState) => !prevState);
  };

  useEffect(() => {
    if (
      methods.formState.dirtyFields.meioPagamento ||
      methods.formState.dirtyFields.finalTime ||
      methods.formState.dirtyFields.initialTime ||
      methods.formState.dirtyFields.deliveryOptions ||
      watch('minimalPrice')
    ) {
      setIsFormDirty(true);
    }
  }, [
    isFormDirty,
    methods.formState.dirtyFields.meioPagamento,
    methods.formState.dirtyFields.finalTime,
    methods.formState.dirtyFields.initialTime,
    methods.formState.dirtyFields.deliveryOptions,
    watch('minimalPrice'),
  ]);

  const filteredPaymentMethods = paymentMethods.filter(
    (payment: IPaymentList) =>
      payment.payment_local_name === 'Pagamento na Entrega' && payment.active
  );

  const filteredOnlinePayment = paymentMethods.filter(
    (payment: IPaymentList) =>
      payment.payment_local_name === 'Pagamento no Aplicativo' && payment.active
  );

  const paymentLocalId =
    filteredOnlinePayment.length > 0 ? filteredOnlinePayment[0].payment_local_id : null;

  return (
    <>
      <Head>
        <title> PAM Parceiro | Configuração</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Configuração"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Configurar Área',
            },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          <Card>
            <Stack
              spacing={{ xs: 4, md: 5 }}
              direction={{ xs: 'column', md: 'column' }}
              sx={{ p: 2 }}
            >
              <Stack spacing={1} direction="row" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: 4 }}>
                  <InputLabel component="legend">*Dias de Funcionamento:</InputLabel>
                  <Select
                    multiple
                    name="weekdays"
                    value={selectedDaysOfWeek}
                    onChange={(e) => {
                      handleDaysOptions(e);
                      setIsSelectErrorDays('');
                      setIsFormDirty(true);
                    }}
                    renderValue={(selected) => selected.join(', ')}
                    label="Dias de Funcionamento"
                    inputProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: isErrorSelectDays?.message ? '#ff5330' : '',
                      },
                    }}
                  >
                    {daysOfWeekOptions.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        <Checkbox checked={selectedDaysOfWeek?.includes(option.value)} />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  {isErrorSelectDays?.message && (
                    <FormHelperText style={{ color: '#ff5330' }} error>
                      {isErrorSelectDays.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <RHFTextField
                  name="initialTime"
                  label="*Horário Inicial"
                  type="time"
                  sx={{ flex: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300,
                  }}
                />

                <RHFTextField
                  name="finalTime"
                  label="*Horário Final"
                  type="time"
                  sx={{ flex: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300,
                  }}
                />
              </Stack>
              <Stack
                spacing={3}
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  gap: '2rem',
                }}
              >
                <FormGroup>
                  <FormLabel component="legend">*Opções de Entrega:</FormLabel>
                  <Controller
                    control={control}
                    name="deliveryOptions"
                    render={({ field }) => (
                      <FormGroup sx={{ paddingLeft: '10px' }}>
                        {deliveryList?.map((option: IAreaDelivery) => (
                          <div key={option.delivery_option_id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  value={option.delivery_option_id}
                                  checked={field.value.includes(option.delivery_option_id)}
                                  onChange={(e) => {
                                    handleChangeCheckbox(e?.target.checked);
                                    handleDeliveryOptionChange(e, option.delivery_option_id, field);
                                    setFreeShipment(option.delivery_option_id, true);

                                    if (!e.target.checked) {
                                      delete selectedShippingOptions[option.delivery_option_id];
                                      delete shippingValue[option.delivery_option_id];
                                    }
                                  }}
                                />
                              }
                              label={option.name}
                            />

                            {field.value.includes(option.delivery_option_id) && (
                              <Stack direction="column" sx={{ paddingLeft: 1 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name={`freteGratis${option.delivery_option_id}`}
                                      value={
                                        selectedShippingOptions[option.delivery_option_id]
                                          ?.freteGratis
                                      }
                                      checked={
                                        selectedShippingOptions[option.delivery_option_id]
                                          ?.freteGratis === true
                                      }
                                      onChange={(event) => {
                                        handleChangeCheckbox(event.target.checked);

                                        if (
                                          selectedShippingOptions[option.delivery_option_id]
                                            ?.freteGratis !== selectedShippingOptions
                                        ) {
                                          setIsFormDirty(true);
                                        }

                                        if (event.target.checked) {
                                          setPaidShipment(
                                            option.delivery_option_id,
                                            !event.target.checked,
                                            selectedShippingOptions[option.delivery_option_id]
                                              .actuation_area_shipping_id
                                          );

                                          setFreeShipment(
                                            option.delivery_option_id,
                                            event.target.checked,
                                            selectedShippingOptions[option.delivery_option_id]
                                              .actuation_area_shipping_id
                                          );
                                        } else {
                                          setFreeShipment(
                                            option.delivery_option_id,
                                            !event.target.checked,
                                            selectedShippingOptions[option.delivery_option_id]
                                              .actuation_area_shipping_id
                                          );

                                          setPaidShipment(
                                            option.delivery_option_id,
                                            event.target.checked,
                                            selectedShippingOptions[option.delivery_option_id]
                                              .actuation_area_shipping_id
                                          );
                                        }
                                      }}
                                      sx={{ paddingLeft: 1 }}
                                    />
                                  }
                                  label="Frete Grátis"
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name={`freteTarifado${option.delivery_option_id}`}
                                        value={
                                          selectedShippingOptions[option.delivery_option_id]
                                            ?.freteTarifado
                                        }
                                        checked={
                                          selectedShippingOptions[option.delivery_option_id]
                                            ?.freteTarifado === true
                                        }
                                        // eslint-disable-next-line consistent-return
                                        onChange={(event) => {
                                          if (
                                            selectedShippingOptions[option.delivery_option_id]
                                              ?.freteTarifado === true
                                          ) {
                                            return null;
                                          }
                                          handleChangeCheckbox(event.target.checked);

                                          if (event.target.checked) {
                                            setValueShipping(option.delivery_option_id, '');
                                            setFreeShipment(
                                              option.delivery_option_id,
                                              !event.target.checked,
                                              selectedShippingOptions[option.delivery_option_id]
                                                .actuation_area_shipping_id
                                            );

                                            setPaidShipment(
                                              option.delivery_option_id,
                                              event.target.checked,
                                              selectedShippingOptions[option.delivery_option_id]
                                                .actuation_area_shipping_id
                                            );
                                          } else {
                                            setPaidShipment(
                                              option.delivery_option_id,
                                              !event.target.checked,
                                              selectedShippingOptions[option.delivery_option_id]
                                                .actuation_area_shipping_id
                                            );
                                            setFreeShipment(
                                              option.delivery_option_id,
                                              event.target.checked,
                                              selectedShippingOptions[option.delivery_option_id]
                                                .actuation_area_shipping_id
                                            );

                                            delete shippingValue[option.delivery_option_id];
                                          }
                                        }}
                                      />
                                    }
                                    label="Frete Tarifado"
                                  />
                                  {selectedShippingOptions[option.delivery_option_id]
                                    ?.freteTarifado && (
                                    <RHFTextField
                                      name={`freteTarifado_${option.delivery_option_id}`}
                                      label="Valor do frete:"
                                      size="small"
                                      helperText={
                                        messageError[option.delivery_option_id] &&
                                        messageError[option.delivery_option_id].id ===
                                          option.delivery_option_id &&
                                        messageError[option.delivery_option_id].message
                                      }
                                      FormHelperTextProps={{ style: { color: '#ff5330' } }}
                                      value={numberToCoin(
                                        shippingValue[option.delivery_option_id]?.value.toString()
                                      )}
                                      onChange={(event) => {
                                        const formattedValue = coinToNumber(event.target.value);
                                        setValueShipping(option.delivery_option_id, formattedValue);
                                        if (
                                          shippingValue[option.delivery_option_id]?.value !==
                                          shippingValue
                                        ) {
                                          setIsFormDirty(true);
                                        }
                                        if (formattedValue) {
                                          delete messageError[option.delivery_option_id];
                                        }
                                      }}
                                      InputProps={{
                                        inputProps: { min: 1 },
                                        startAdornment: (
                                          <InputAdornment position="start">R$</InputAdornment>
                                        ),
                                      }}
                                      sx={{ width: '140px' }}
                                    />
                                  )}
                                </div>
                              </Stack>
                            )}
                          </div>
                        ))}
                      </FormGroup>
                    )}
                  />
                  {errors.deliveryOptions && (
                    <Alert severity="error">{errors.deliveryOptions.message}</Alert>
                  )}
                </FormGroup>

                {filteredOnlinePayment.length > 0 ? (
                // {bankAccount && filteredOnlinePayment.length > 0 ? (
                  <FormGroup>
                    <FormLabel component="legend">*Pagamento Digital:</FormLabel>
                    <Controller
                      control={control}
                      name="meioPagamento"
                      render={({ field }) => (
                        <FormGroup
                          sx={{
                            paddingLeft: '10px',
                          }}
                        >
                          {paymentMethods
                            .filter(
                              (payment: any) =>
                                payment.payment_local_name === 'Pagamento no Aplicativo'
                            )
                            .map((option: any) => {
                              if (option.active) {
                                return (
                                  <div
                                    key={option.payment_options_id}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          {...field}
                                          value={option.payment_options_id}
                                          checked={field.value.includes(option.payment_options_id)}
                                          onChange={(e) => {
                                            setPaymentsId(
                                              option.payment_options_id,
                                              option.actuation_area_payments_id || null
                                            );
                                            handlePaymentOption(
                                              e,
                                              option.payment_options_id,
                                              field
                                            );
                                          }}
                                        />
                                      }
                                      label={option.description}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </FormGroup>
                      )}
                    />

                    {errors.meioPagamento && (
                      <Alert severity="error">{errors.meioPagamento.message}</Alert>
                    )}

                    <RHFTextField
                      name="minimalPrice"
                      label="Valor mínimo de compras nesta filial:"
                      variant="outlined"
                      sx={{ mt: 2 }}
                      InputProps={{
                        inputProps: { min: 1 },
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                      size="small"
                      value={numberToCoin(isEdit ? minValue : minStandardValue)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const formattedValue = coinToNumber(e.target.value);
                        if (isEdit) {
                          setMinValue(formattedValue);
                        } else {
                          setMinStandardValue(formattedValue);
                        }

                        setValue('minimalPrice', formattedValue);
                      }}
                    />

                    <Box sx={{ color: '#555', mt: '5px', paddingLeft: '5px' }}>
                      <Typography sx={theme.typography.caption}>
                        *Somente para pagamentos digitais.
                      </Typography>
                    </Box>
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <FormLabel component="legend">*Pagamento Digital:</FormLabel>

                    {filteredOnlinePayment.length > 0 ? (
                      <Button
                        onClick={handleRedirectToBankAccount}
                        sx={{
                          gap: 1,
                          cursor: 'pointer',
                          width: '200px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: '#ff0000',
                        }}
                      >
                        Necessário cadastrar dados bancários antes de configurar o pagamento digital
                      </Button>
                    ) : (
                      <span
                        style={{
                          color: '#ff0000',
                          fontSize: '14px',
                          width: '200px',
                          marginTop: '10px',
                        }}
                      >
                        Não há meios de pagamentos digitais cadastrados, entre em contato com o
                        Administrador.
                      </span>
                    )}
                  </FormGroup>
                )}

                {filteredPaymentMethods.length <= 0 ? null : (
                  <FormGroup>
                    <FormLabel component="legend">*Pagamento na Entrega:</FormLabel>
                    <Controller
                      control={control}
                      name="meioPagamento"
                      render={({ field }) => (
                        <FormGroup
                          sx={{
                            paddingLeft: '10px',
                          }}
                        >
                          {paymentMethods
                            .filter(
                              (payment: any) =>
                                payment.payment_local_name === 'Pagamento na Entrega'
                            )
                            .map((option: any) => {
                              if (option.active) {
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                      key={option.payment_options_id}
                                      control={
                                        <Checkbox
                                          {...field}
                                          value={option.payment_options_id}
                                          checked={field.value.includes(option.payment_options_id)}
                                          onChange={(e) => {
                                            setPaymentsId(
                                              option.payment_options_id,
                                              option.actuation_area_payments_id || null
                                            );
                                            handlePaymentOption(
                                              e,
                                              option.payment_options_id,
                                              field
                                            );
                                          }}
                                        />
                                      }
                                      label={option.description}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </FormGroup>
                      )}
                    />

                    {errors.meioPagamento && (
                      <Alert severity="error">{errors.meioPagamento.message}</Alert>
                    )}
                  </FormGroup>
                )}
              </Stack>
              <Stack
                alignItems="flex-end"
                direction="row"
                justifyContent="space-between"
                sx={{ mb: -2, mt: 2, color: '#555' }}
              >
                <Typography sx={theme.typography.caption}>*Preenchimento obrigatório.</Typography>
              </Stack>
            </Stack>
          </Card>

          <Stack justifyContent="flex-end" direction="row" spacing={1} sx={{ mt: 3 }}>
            <LoadingButton
              // size="large"
              color="inherit"
              type="button"
              variant="contained"
              loading={isSubmitting}
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
              // size="large"
              color="inherit"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isFormDirty}
              onClick={() => {
                if (selectedDaysOfWeek.length === 0) {
                  setIsSelectErrorDays({
                    message: 'Selecione o dia de funcionamento',
                  });
                }
              }}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Salvar Alterações
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}

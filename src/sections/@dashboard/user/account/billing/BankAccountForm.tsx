import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IBankAccount } from 'src/@types/partner';
import { useAuthContext } from 'src/auth/useAuthContext';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import {
  PAGSEGURO_CONNECT_CLIENT_ID,
  PAGSEGURO_CONNECT_SCOPE,
  URL_PAGSEGURO,
  URL_PAGSEGURO_REDIRECT,
} from 'src/config-global';
import { createBankAccount, getBankAccount, updateBankAccount } from 'src/service/partner';
import { bankList } from 'src/utils/bankList';
import * as Yup from 'yup';

type FormValuesProps = {
  bankName: string;
  agencyNumber: string;
  optionalDigitAgency: string;
  accountNumber: string;
  optionalDigitAccount: string;
  accountId: any;
};

interface IselectedBank {
  ispb: string;
  name: string;
  code: any;
  fullName: string;
}

export default function BankAccountForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [bankAccount, setBankAccount] = useState<IBankAccount>();
  const storedPartnerId = localStorage.getItem('partnerId');
  const parsedPartnerId = storedPartnerId !== null ? JSON.parse(storedPartnerId) : null;
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { user } = useAuthContext();
  const theme = useTheme();

  const [selectBank, setSelectedBank] = useState<IselectedBank>();

  const sortedList: any = bankList.sort((a, b) => a.code - b.code);

  const NewAccount = Yup.object().shape({
    bankName: Yup.string().required('Selecione um banco válido'),
    agencyNumber: Yup.string()
      .max(5, 'Máximo de 5 caracteres por agência')
      .required('Informe o número da agência'),
    accountNumber: Yup.string()
      .max(20, 'Máximo de 20 caracteres por número de conta')
      .required('Informe o número da conta'),
  });

  const defaultValues = {
    bankName: '',
    agencyNumber: '',
    optionalDigitAgency: '',
    accountNumber: '',
    optionalDigitAccount: '',
    accountId: bankAccount?.account_id || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAccount),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const getBankAccountData = async () => {
    try {
      const response = await getBankAccount(parsedPartnerId?.partner_id);
      setBankAccount(response);
      // console.log(response);
      const lastDigitAccount = response?.account_number[response?.account_number?.length - 1];
      const lastDigitAgency = response?.agency[response?.agency?.length - 1];

      setValue('agencyNumber', response?.agency.slice(0, -1));
      setValue('accountNumber', response?.account_number.slice(0, -1));
      setValue('optionalDigitAgency', lastDigitAgency);
      setValue('optionalDigitAccount', lastDigitAccount);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    const digitAgency =
      data?.optionalDigitAgency === '' || data?.optionalDigitAgency.toLocaleLowerCase() === 'x'
        ? '0'
        : data?.optionalDigitAgency;

    const digitAccount =
      data?.optionalDigitAccount === '' || data?.optionalDigitAccount.toLocaleLowerCase() === 'x'
        ? '0'
        : data?.optionalDigitAccount;
    const params = {
      partner_id: parsedPartnerId?.partner_id,
      bank: selectBank !== undefined ? JSON.stringify(selectBank?.code) : bankAccount?.bank,
      agency: data.agencyNumber + digitAgency,
      account_number: data.accountNumber + digitAccount,
      account_id: data?.accountId || '',
    };

    const updateParams = {
      bank_details_id: bankAccount?.bank_details_id,
      bank: selectBank !== undefined ? JSON.stringify(selectBank?.code) : bankAccount?.bank,
      agency: data.agencyNumber + digitAgency,
      account_number: data.accountNumber + digitAccount,
      active: bankAccount?.active,
      account_id: data?.accountId || '',
    };
    try {
      if (bankAccount) {
        const response = await updateBankAccount(updateParams);
        enqueueSnackbar('Dados bancários atualizados com sucesso', {
          variant: 'success',
        });
        setBankAccount(response);
        getBankAccountData();
      } else {
        const response = await createBankAccount(params);
        console.log(response);
        enqueueSnackbar('Dados bancários cadastrados com sucesso', {
          variant: 'success',
        });
      }
      setIsSelected(false);
    } catch (error) {
      enqueueSnackbar('Não foi possível cadastrar os dados bancários, tente novamente mais tarde', {
        variant: 'error',
      });
      console.log(error);
    }
  };

  const matchBankCode = () => {
    // eslint-disable-next-line eqeqeq
    const filteredCode = bankList.filter((bank: any) => bank.code == bankAccount?.bank);
    if (bankAccount?.bank !== null && bankAccount?.bank !== undefined) {
      setValue('bankName', `${filteredCode[0]?.code} - ${filteredCode[0]?.name}`);
    } else {
      setValue('bankName', '');
    }
  };

  useEffect(() => {
    matchBankCode();

    if (bankAccount?.account_id) {
      setValue('accountId', bankAccount?.account_id);
    } else {
      setValue('accountId', '');
    }
  }, [bankAccount]);

  useEffect(() => {
    getBankAccountData();
  }, []);

  const handleClickConnectPagseguro = () => {
    if (user) {
      window.location.replace(
        `${URL_PAGSEGURO}response_type=code&client_id=${PAGSEGURO_CONNECT_CLIENT_ID}&redirect_uri=${URL_PAGSEGURO_REDIRECT}&scope=${PAGSEGURO_CONNECT_SCOPE}&state=${user?.user_id}`
      );
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center">
        <LoadingButton
          type="submit"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
            '&:hover': {
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
            },
          }}
          variant="contained"
          onClick={handleClickConnectPagseguro}
          disabled={watch('accountId')}
        >
          Conectar a Conta PagSeguro
        </LoadingButton>
      </Stack>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mt: 2 }}>
          <Stack spacing={3} sx={{ overflow: 'unset', mt: 2 }}>
            <Stack>
              <RHFTextField
                fullWidth
                label="ID PagSeguro:"
                name="accountId"
                disabled
                inputProps={{
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 41) {
                      input.value = input.value.slice(0, 41);
                    }
                  },
                }}
              />
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography
                variant="overline"
                sx={{
                  flexGrow: 1,
                  color: 'text.secondary',
                }}
              >
                Cadastre seus dados bancários:
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFAutocomplete
                sx={{ width: '100%' }}
                name="bankName"
                label="Selecione seu banco:"
                freeSolo
                options={sortedList.map((bank: any) => `${bank.code}-${bank.name}`)}
                onChange={(event, newValue: any) => {
                  const selectedBank = sortedList.find(
                    (bank: any) => `${bank.code}-${bank.name}` === newValue
                  );

                  setSelectedBank(selectedBank);
                  setIsSelected(true);

                  setValue('bankName', newValue);
                }}
                helperText={errors.bankName?.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                fullWidth
                name="agencyNumber"
                label="*Número da agência"
                type="number"
                inputProps={{
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 5) {
                      input.value = input.value.slice(0, 5);
                    }
                  },
                }}
              />

              <RHFTextField
                fullWidth
                label="Dígito"
                name="optionalDigitAgency"
                inputProps={{
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 1) {
                      input.value = input.value.slice(0, 1);
                    }
                  },
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                fullWidth
                label="*Número da conta"
                inputProps={{
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 20) {
                      input.value = input.value.slice(0, 20);
                    }
                  },
                }}
                name="accountNumber"
                type="number"
              />

              <RHFTextField
                fullWidth
                label="Dígito"
                name="optionalDigitAccount"
                inputProps={{
                  onInput: (e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 1) {
                      input.value = input.value.slice(0, 1);
                    }
                  },
                }}
              />
            </Stack>
          </Stack>

          <Stack
            sx={{
              mt: 2,
              gap: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
              disabled={
                watch('agencyNumber') + watch('optionalDigitAgency') === bankAccount?.agency &&
                watch('accountNumber') + watch('optionalDigitAccount') ===
                  bankAccount?.account_number &&
                !isSelected
              }
            >
              {bankAccount?.agency && bankAccount?.account_number && bankAccount?.bank
                ? 'Atualizar dados bancários'
                : 'Salvar dados bancários'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}

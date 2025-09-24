import { Card, InputAdornment, Stack, TextField, Grid, Button, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { getOrderByPartner } from 'src/service/order';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useTheme } from '@mui/material/styles';
import { useTable } from 'src/components/table';
import { IOrderDetails } from 'src/@types/order';
import Iconify from '../../../components/iconify';
import TableList from './components/table';

OrdersListCart.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrdersListCart() {
  const theme = useTheme();

  const { rowsPerPage, onChangeRowsPerPage } = useTable();

  const STATUS = [
    { value: '', label: '‎' },
    { value: 'Aguardando pagamento', label: 'Aguardando pagamento' },
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Aceito', label: 'Aceito' },
    { value: 'Recusado', label: 'Recusado' },
    { value: 'Em andamento', label: 'Em andamento' },

    { value: 'Cancelado pelo cliente', label: 'Cancelado pelo cliente' },
  ];

  const [page, setPage] = useState(0);
  const [ordersList, setOrdersList] = useState<IOrderDetails>();
  const { setPartnerOrdersList } = useGlobalContext();
  const { partnerId } = useAuthContext();
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchOrder, setSearchOrder] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchConsumer, setSearchConsumer] = useState<string>('');
  const [searchBranch, setSearchBranch] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<Date | null>(null);
  const [searchEndDate, setSearchEndDate] = useState<Date | null>(null);
  const [filterCleared, setFilterCleared] = useState(false);

  const getOrdersList = async (sortByOrder: any = '') => {
    setLoading(true);
    const data = {
      partner_id: partnerId?.partner_id,
      order_number: searchOrder,
      status: searchStatus,
      consumer: searchConsumer,
      filial: searchBranch,
      page: page + 1,
      itensPerPage: rowsPerPage,
      start_date: searchStartDate || '',
      end_date: searchEndDate || '',
    };

    try {
      const response = await getOrderByPartner(data);

      const sortedOrders = response.orders.sort((x: any, y: any) => {
        const dateX = new Date(x.created_at).getTime();
        const dateY = new Date(y.created_at).getTime();
        return dateY - dateX;
      });

      setOrdersList(sortedOrders);

      setPartnerOrdersList(response);
      setTotalPages(response?.pagination.totalPages);
      setTotalRows(response?.pagination?.totalRows);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterStartDate = (date: Date | null) => {
    if (date !== null) {
      setSearchStartDate(date);
    }
  };

  const handleFilterEndDate = (date: Date | null) => {
    if (date !== null) {
      setSearchEndDate(date);
    }
  };

  const clearFilters = () => {
    setSearchStartDate(null);
    setSearchEndDate(null);
    setSearchStatus('');
    setSearchConsumer('');
    setSearchBranch('');
    setSearchOrder('');
    setFilterCleared(true);
  };

  useEffect(() => {
    if (filterCleared) {
      getOrdersList();
      setFilterCleared(false);
    } else {
      getOrdersList();
    }
  }, [filterCleared]);

  useEffect(() => {
    getOrdersList();
  }, [page, rowsPerPage]);

  return (
    <Card sx={{ mb: 2, p: 3 }}>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Pesquisar por id do pedido"
            placeholder="ID do pedido"
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            sx={{ flex: 1 }}
            fullWidth
            label="Pesquisar por cliente"
            placeholder="Cliente"
            value={searchConsumer}
            onChange={(e) => {
              setSearchConsumer(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            sx={{ flex: 1 }}
            fullWidth
            label="Pesquisar por filial"
            placeholder="Filial"
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Pesquisar por status"
            placeholder="Status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            {STATUS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <Stack>
              <DatePicker
                ignoreInvalidInputs
                inputFormat="dd/MM/yyyy"
                label="Data Inicial"
                maxDate={new Date(new Date())}
                value={searchStartDate}
                onChange={handleFilterStartDate}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'DD/MM/AAAA',
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack>
              <DatePicker
                ignoreInvalidInputs
                inputFormat="dd/MM/yyyy"
                label="Data Final"
                minDate={new Date(searchStartDate || new Date())}
                maxDate={new Date(new Date())}
                value={searchEndDate}
                onChange={handleFilterEndDate}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'DD/MM/AAAA',
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                height: '100%',
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="eva:search-fill" />}
                onClick={() => getOrdersList('sortByOrder')}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  },
                }}
              >
                Pesquisar
              </Button>

              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="ant-design:clear-outlined" />}
                onClick={() => clearFilters()}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                  },
                }}
              >
                Limpar Filtros
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </LocalizationProvider>

      <TableList
        ordersList={ordersList}
        totalRows={totalRows}
        currentPage={(value: any) => setPage(value)}
        loading={loading}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Card>
  );
}

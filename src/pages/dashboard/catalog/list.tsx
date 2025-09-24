import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import NextLink from 'next/link';
import {
  Container,
  InputAdornment,
  TextField,
  Stack,
  Pagination,
  Card,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getProducts, productCreate } from 'src/service/product';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { TableNoData, useTable } from 'src/components/table';
import { getBranchByPartner } from 'src/service/partner';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IGetBranch } from 'src/@types/user';
import { IProductList } from 'src/@types/product';
import { PATH_DASHBOARD } from '../../../routes/paths';
import DashboardLayout from '../../../layouts/dashboard';
import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ItemCard from './components/itemCard';
import { useSnackbar } from '../../../components/snackbar';

CatalogItens.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CatalogItens() {
  const { rowsPerPage } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();
  const { setProducts, selectedBranch, setSelectedBranch } = useGlobalContext();
  const { signalRUserConnection } = useAuthContext();
  const { partnerId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState('');

  const [productsList, setProductsList] = useState<IProductList[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [branchList, setBranchList] = useState<IGetBranch>();

  const getProductsList = async () => {
    const data = {
      branch_id: selectedBranch,
      filter,
      page: currentPage,
      itensPerPage: rowsPerPage,
    };
    try {
      const response = await getProducts(data);
      setProductsList(response.products);
      setIsLoading(false);
      setProducts(response.products);
      setTotalPages(response.pagination.totalPages);
      setTotalRows(response.pagination.totalRows);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductPartner = async (product: any) => {
    try {
      await productCreate({
        base_product_id: product.product_id,
        branch_id: selectedBranch,
        description: product.description,
        price: product.minimum_price,
        active: product.active,
        name: product.name,
        created_by: product.created_by,
      });

      getProductsList();
      enqueueSnackbar('Serviço ou produto vinculado com sucesso');
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Não foi possível vincular o serviço ou produto', { variant: 'error' });
    }
  };

  const getBranchList = async () => {
    const data = {
      partner_id: partnerId?.partner_id,
      filter: '',
      page: 1,
      itensPerPage: 1000,
    };

    try {
      const response = await getBranchByPartner(data);
      setBranchList(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getProductsList();
  }, [currentPage, selectedBranch, signalRUserConnection, filter]);

  const handleSearchChange = (event: any) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  useEffect(() => {
    if (signalRUserConnection) {
      signalRUserConnection.on('RefreshProductListOnPartner', () => {
        console.info('signal', signalRUserConnection);
        getProductsList();
      });
    }
  }, [signalRUserConnection, getProductsList]);

  return (
    <>
      <Head>
        <title>Parceiro | Produtos e Serviços</title>{' '}
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Produtos e Serviços"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Serviços e Produtos' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.catalog.new}
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'dark' ? 'common.white' : 'common.white',
                },
              }}
            >
              Novo Produto/Serviço
            </Button>
          }
        />
        <Card sx={{ p: 2 }}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="select-label">Filial</InputLabel>
            <Select
              name="branchs"
              label="Filial"
              value={selectedBranch}
              onChange={(e: SelectChangeEvent) => {
                setSelectedBranch(e.target.value as string);
              }}
            >
              {branchList?.branches?.map((value: any) => (
                <MenuItem value={value.branch_id}>{value.branch_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            value={filter}
            onChange={handleSearchChange}
            placeholder="Pesquisar por nome..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Stack
            sx={{
              p: 2,
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            {productsList?.length === 0 && <TableNoData isNotFound />}

            {!isLoading && !productsList && (
              <Stack>
                <Typography paragraph>Não há dados para exibição</Typography>
              </Stack>
            )}

            {selectedBranch === '' ? (
              <Stack>
                <Typography paragraph>
                  Selecione uma filial para visualizar o catálogo de produtos e serviços.
                </Typography>
              </Stack>
            ) : (
              <>
                {!productsList ? (
                  <Icon icon="eos-icons:bubble-loading" width="50" height="50" />
                ) : (
                  productsList?.map((item: any) => (
                    <ItemCard
                      key={item.product_id}
                      name={item.name}
                      price={item.minimum_price}
                      image={item.url}
                      createProduct={() => getProductPartner(item)}
                    />
                  ))
                )}
              </>
            )}
          </Stack>
          {productsList && productsList?.length > 0 && selectedBranch !== '' && (
            <Stack
              sx={{
                p: 2,
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Pagination
                count={totalPages}
                shape="rounded"
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </Stack>
          )}
        </Card>
      </Container>
    </>
  );
}

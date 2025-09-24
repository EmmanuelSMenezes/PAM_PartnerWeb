import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
  TableHead,
  Box,
  TableCell,
  TableRow,
  Skeleton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';
import { getDeleteProduct, getProductByPartner } from 'src/service/product';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { hexToRgb } from 'src/utils/hexToRgb';
import Iconify from 'src/components/iconify';
import { IProduct } from 'src/@types/product';
import { getBranchByPartner } from 'src/service/partner';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import { useTable, TablePaginationCustom } from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import ItemTableRow from './ItemTableRow';

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Produtos/Serviços', align: 'center' },
  { id: 'price', label: 'Preço', align: 'center' },
  { id: 'status', label: 'Ativar', align: 'center' },
  { id: 'action', label: 'Ação', align: 'center' },
];

PartnerCatalogList.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function PartnerCatalogList() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { setProducts, selectedBranch, setSelectedBranch } = useGlobalContext();
  const { partnerId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const [partnerProductsList, setPartnerProductsList] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [filter, setFilter] = useState('');

  const [branchList, setBranchList] = useState<any>([]);
  const [branch, setBranch] = useState<string>('');

  const [productId, setProductId] = useState<any>();

  const getProductPartnerList = async () => {
    const data = {
      branch_id: branch,
      filter,
      page: page + 1,
      itensPerPage: rowsPerPage,
    };
    try {
      const response = await getProductByPartner(data);
      setProductId(response?.product_id);
      setPartnerProductsList(response.products);
      setProducts(response);
      setTotalPages(response.pagination.totalPages);
      setTotalRows(response.pagination.totalRows);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.catalog.edit(paramCase(id)));
  };

  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    setFilter(value);
    setPage(0);
  };

  const handleDeleteRow = async (product_id: string) => {
    try {
      await getDeleteProduct(product_id);
      await getProductPartnerList();

      enqueueSnackbar('Serviço ou produto desvinculado com sucesso');
    } catch (error) {
      console.log(error);

      enqueueSnackbar('Não foi possível desvincular o serviço ou produto', { variant: 'error' });
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
      setBranchList(response.branches);
      setLoading(false);
      if (
        selectedBranch &&
        response.branches.find((branchId: any) => branchId.branch_id === selectedBranch)
      ) {
        setSelectedBranch(selectedBranch);
        setBranch(selectedBranch);
      } else if (response.branches.length > 0) {
        setSelectedBranch(response.branches[0].branch_id);
        setBranch(response.branches[0].branch_id);
        await getProductPartnerList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedBranch !== '') {
      getProductPartnerList();
    }
    getBranchList();
  }, [selectedBranch]);

  useEffect(() => {
    getProductPartnerList();
  }, [selectedBranch]);

  useEffect(() => {
    getProductPartnerList();
  }, [page, branch, rowsPerPage, filter]);

  return (
    <>
      <Head>
        <title> Parceiro | Catálogo de Itens</title>{' '}
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Meus Produtos e Serviços"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Serviços e Produtos do Parceiro' },
          ]}
        />
        <Card sx={{ p: 3 }}>
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
              {branchList?.map((value: any) => (
                <MenuItem value={value.branch_id}>{value.branch_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            value={filter}
            onChange={handleSearchChange}
            placeholder="Pesquisar por produto/serviço..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, borderRadius: '8px' }}>
              <Table size={dense ? 'small' : 'medium'}>
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
                  {!loading && !partnerProductsList.length && branch?.length > 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        Não há produtos ou serviços vinculados a esta filial.
                      </TableCell>
                    </TableRow>
                  )}
                  {branch?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        Selecione uma filial.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {loading ? (
                        <>
                          {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                              {[...Array(3)].map((__, cellIndex) => (
                                <TableCell key={cellIndex} colSpan={1} align="center">
                                  <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={10}
                                    sx={{ mb: 1 }}
                                  />
                                </TableCell>
                              ))}
                              <TableCell colSpan={1} align="center">
                                <Skeleton
                                  variant="rectangular"
                                  width="100%"
                                  height={10}
                                  sx={{ mb: 1 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        partnerProductsList?.map((product: any) => (
                          <ItemTableRow
                            key={product.product_id}
                            row={product}
                            selected={selected.includes(product.product_id)}
                            onSelectRow={() => onSelectRow(product.product_id)}
                            onEditRow={() => handleEditRow(product.product_id)}
                            onDeleteRow={() => handleDeleteRow(product.product_id)}
                            selectedId={product.product_id}
                            getProductPartnerList={getProductPartnerList}
                          />
                        ))
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePaginationCustom
            labelRowsPerPage="Itens por Página"
            count={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={onChangeRowsPerPage}
            // dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableCell,
  Box,
  TableHead,
  InputAdornment,
  TextField,
  TableRow,
  Skeleton,
} from '@mui/material';
import products from 'src/@types/products';
import { hexToRgb } from 'src/utils/hexToRgb';
import { getBranchByPartner, getBranchDelete } from 'src/service/partner';
import { paramCase } from 'change-case';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import BranchsTableRow from 'src/sections/@dashboard/invoice/list/BranchsTableRow';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { IInvoice } from '../../../../@types/invoice';
import DashboardLayout from '../../../../layouts/dashboard';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../../components/table';

const TABLE_HEAD = [
  { id: 'createDate', label: 'Nome' },
  { id: 'createDate', label: 'CEP' },
  { id: 'createDate', label: 'Endereço de Atuação' },
  { id: 'createDate', label: 'Cidade/UF' },
  { id: 'action', label: 'Ação' },
];

List.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function List() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

  const {
    dense,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    page,
    onSelectAllRows,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(products);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { setBranchList, branchList } = useGlobalContext();
  const { partnerId } = useAuthContext();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    setFilterName(value);
    setPage(0);
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.area.edit(paramCase(id)));
  };

  const handleDeleteRow = async (id: string) => {
    const branchId = [id];
    try {
      await getBranchDelete(branchId);
      // setBranchList(response);

      await getBranchList();
      enqueueSnackbar('Filial excluída com sucesso');
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Não foi possível excluir a filial', { variant: 'error' });
    }
  };

  const getBranchList = async () => {
    const data = {
      partner_id: partnerId?.partner_id,
      filter: filterName,
      page: page + 1,
      itensPerPage: rowsPerPage,
    };
    try {
      const response = await getBranchByPartner(data);
      const sortedBranches = response.branches.sort((a: any, b: any) =>
        a.branch_name.localeCompare(b.branch_name)
      );
      setBranchList(sortedBranches);
      setIsLoading(false);

      setTotalPages(response.pagination.totalPages);
      setTotalRows(response.pagination.totalRows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterName]);

  return (
    <>
      <Head>
        <title> Parceiro | Filiais</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Filiais"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Filiais',
            },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.area.new}
              variant="contained"
              color="inherit"
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
              Criar Filial
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={handleSearchChange}
            placeholder="Pesquisar..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer sx={{ minWidth: 800, borderRadius: '8px' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              // onDeleteRow={() => handleDeleteRows(selected)}
              onSelectAllRows={(checked: boolean) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                          // color: (externalTheme) => externalTheme.palette.primary.dark,
                        }}
                      >
                        {headCell.label}
                      </Box>
                    </TableCell>
                  ))}
                </TableHead>

                <TableBody>
                  {isLoading && !branchList && (
                    <>
                      {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                          {[...Array(2)].map((__, cellIndex) => (
                            <TableCell key={cellIndex} colSpan={2} align="center">
                              <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
                            </TableCell>
                          ))}
                          <TableCell colSpan={5} align="center">
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
                  )}

                  {branchList?.length === 0 && !isLoading && <TableNoData isNotFound />}

                  {branchList?.map((branch: any) => (
                    <BranchsTableRow
                      key={branch.id}
                      row={branch}
                      selected={selected.includes(branch.branch_id)}
                      // onSelectRow={() => onSelectRow(branch.branch_id)}
                      // onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(branch.branch_id)}
                      onDeleteRow={() => handleDeleteRow(branch.branch_id)}
                    />
                  ))}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            labelRowsPerPage="Itens por Página"
            count={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={onChangeRowsPerPage}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}: {
  inputData: IInvoice[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        invoice.invoiceTo?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === filterStatus);
  }

  if (filterService !== 'all') {
    inputData = inputData.filter((invoice) =>
      invoice.items?.some((c) => c.service === filterService)
    );
  }

  return inputData;
}

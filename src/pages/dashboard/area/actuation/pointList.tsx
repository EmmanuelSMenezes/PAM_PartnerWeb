import { useEffect, useState } from 'react';
import Head from 'next/head';
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
import { paramCase } from 'change-case';
import { getBranchByPartner } from 'src/service/partner';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IBranchByPartnerAdress } from 'src/@types/branch';
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
  TablePaginationCustom,
} from '../../../../components/table';

import { PointsTableRow } from '../../../../sections/@dashboard/invoice/list';

const TABLE_HEAD = [
  { id: '', label: '' },
  { id: 'createDate', label: 'Nome' },
  { id: 'createDate', label: 'Endereço de Atuação' },
];

PointList.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function PointList() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(products);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [branchList, setBranchList] = useState<IBranchByPartnerAdress[]>();
  const [totalRows, setTotalRows] = useState(0);
  const { branchData } = useGlobalContext();
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

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPage(0);
    setFilterName(value);
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.area.edit(paramCase(id)));
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
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
      setBranchList(response.branches);
      setTotalRows(response?.pagination?.totalRows);
      setIsLoading(false);
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
        <title> Parceiro | Criação de Área</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Criação de Área"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Criação de Área',
            },
          ]}
          action={
            <Button
              onClick={() => push(PATH_DASHBOARD.area.map)}
              variant="contained"
              color="inherit"
              disabled={!(selected && branchData)}
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
              Criar Área
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={handleFilterName}
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
                        }}
                      >
                        {headCell.label}
                      </Box>
                    </TableCell>
                  ))}
                </TableHead>

                <TableBody>
                  {isLoading && branchList?.length === 0 && (
                    <>
                      {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                          {[...Array(2)].map((__, cellIndex) => (
                            <TableCell key={cellIndex} colSpan={1} align="center">
                              <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
                            </TableCell>
                          ))}
                          <TableCell colSpan={2} align="center">
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
                    <PointsTableRow
                      key={branch.branch_id}
                      row={branch}
                      selected={selected.includes(branch.branch_id)}
                      onSelectRow={() => onSelectRow(branch.branch_id)}
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
            count={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event: any, value: any) => setPage(value)}
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

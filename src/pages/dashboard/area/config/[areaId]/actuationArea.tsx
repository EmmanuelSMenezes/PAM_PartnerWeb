import { useState } from 'react';
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
} from '@mui/material';
import products from 'src/@types/products';
import { hexToRgb } from 'src/utils/hexToRgb';
import { paramCase } from 'change-case';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { IInvoice } from '../../../../../@types/invoice';
import DashboardLayout from '../../../../../layouts/dashboard';
import Iconify from '../../../../../components/iconify';
import Scrollbar from '../../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../../../components/table';

import { PointsTableRow } from '../../../../../sections/@dashboard/invoice/list';

const TABLE_HEAD = [
  { id: '', label: '' },
  { id: 'createDate', label: 'Nome' },
  { id: 'createDate', label: 'Endereço de Atuação' },

  { id: 'action', label: 'Ação' },
];

OccupationAreaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function OccupationAreaPage() {
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
    onSelectAllRows,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(products);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  // const [branchList, setBranchList] = useState<any>(); // arrumar
  const { branchList } = useGlobalContext();

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

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.area.edit(paramCase(id)));
  };

  // const handleResetFilter = () => {
  //   setFilterName('');
  //   setFilterStatus('all');
  //   setFilterService('all');
  //   setFilterEndDate(null);
  //   setFilterStartDate(null);
  // };

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

  const handleDeleteRows = async (selectedRows: string[]) => {
    selectedRows.forEach((value) => {
      tableData.forEach((row, index) => {
        if (row.id === value) {
          tableData.splice(index, 1);
        }
      });
    });

    setSelected([]);
    setTableData(tableData);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  // const getBranchList = async () => {
  //   try {
  //     const response = await getBranch();
  //     setBranchList(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getBranchList();
  //   console.log('list', branchList);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Head>
        <title> Pontos de Atuação</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Pontos de Atuação"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Pontos de Atuação',
            },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.area.map}
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
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onDeleteRow={() => handleDeleteRows(selected)}
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
                        }}
                      >
                        {headCell.label}
                      </Box>
                    </TableCell>
                  ))}
                </TableHead>

                <TableBody>
                  {branchList?.map((branch: any) => (
                    <PointsTableRow
                      key={branch.id}
                      row={branch}
                      selected={selected.includes(branch.branch_id)}
                      onSelectRow={() => onSelectRow(branch.branch_id)}
                      // onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(branch.branch_id)}
                      onDeleteRow={() => handleDeleteRow(branch.branch_id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            // dense={dense}
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

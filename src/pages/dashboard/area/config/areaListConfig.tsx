import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableHead,
  Box,
  TableCell,
  InputAdornment,
  TextField,
  TableRow,
  useTheme,
  Skeleton,
} from '@mui/material';
import { hexToRgb } from 'src/utils/hexToRgb';
import { getAreaByPartnerId } from 'src/service/area';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import { useTable, TablePaginationCustom, TableNoData } from '../../../../components/table';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { AreaTableRow } from '../../../../sections/@dashboard/e-commerce/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Área de Atuação', align: 'center' },
  { id: 'status', label: 'Ativo', align: 'center' },
  { id: 'action', label: 'Ação', align: 'center' },
];

AreaList.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function AreaList() {
  const {
    dense,
    page,
    rowsPerPage,
    selected,
    onSelectRow,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const theme = useTheme();
  const { partnerId } = useAuthContext();
  const [searchItem, setSearchItem] = useState('');
  const [areaList, setAreaList] = useState<any>();
  const { themeStretch } = useSettingsContext();

  const handleSearchChange = (event: any) => {
    setSearchItem(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    // const deleteRow = areaList.filter((row) => row.id !== id);
    // setTableData(deleteRow);
    // setSelected([]);
    // console.log('aki', deleteRow);
    // if (page > 0 && deleteRow.length < rowsPerPage) {
    //   setPage(page - 1);
    // }
  };

  const getAreaList = async () => {
    try {
      const response = await getAreaByPartnerId(partnerId?.partner_id);
      setAreaList(response);
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, (areaList?.length ?? 0) - (page ?? 0) * rowsPerPage);

  useEffect(() => {
    getAreaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title> PAM | Configuração de Atuação</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Configuração da Atuação"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Áreas de Atuação',
            },
            // { name: areaList?features[0].properties.name },
          ]}
          // component={NextLink}
          // href={PATH_DASHBOARD.area.new}
          action={
            <Button
              // component={NextLink}
              // href={PATH_DASHBOARD.area.config}
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
              Configurar
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={searchItem}
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
                          // cursor: 'pointer',
                          gap: '5px',
                        }}
                      >
                        {headCell.label}
                      </Box>
                    </TableCell>
                  ))}
                </TableHead>

                <TableBody>
                  {areaList?.length === 0 && (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <TableRow key={index}>
                          {[...Array(2)].map((__, cellIndex) => (
                            <TableCell key={cellIndex} colSpan={1} align="center">
                              <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
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
                  )}

                  {areaList?.length < 0 ? (
                    <TableNoData isNotFound />
                  ) : (
                    areaList?.map((product: any) => (
                      <AreaTableRow
                        key={product.id}
                        row={product}
                        selected={selected.includes(product.id)}
                        onSelectRow={() => onSelectRow(product.id)}
                        onEditRow={() => onSelectRow(product.id)}
                        onDeleteRow={() => handleDeleteRow(product.id)}
                        areaList={areaList}
                        // onViewRow={() => onSelectRow(product.id)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={areaList?.length || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            emptyRows={emptyRows}
            // dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

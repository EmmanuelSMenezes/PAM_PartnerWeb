import {
  Box,
  Button,
  Card,
  Container,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';
import { paramCase } from 'change-case';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { deleteArea, getAreaByPartnerId } from 'src/service/area';
import { getBranch } from 'src/service/partner';
import { hexToRgb } from 'src/utils/hexToRgb';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IBranchList } from 'src/@types/branch';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import { useSettingsContext } from '../../../../components/settings';
import { TableNoData, TablePaginationCustom, useTable } from '../../../../components/table';
import DashboardLayout from '../../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { AreaTableRow } from '../../../../sections/@dashboard/e-commerce/list';

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Área de Atuação', align: 'center' },
  { id: 'status', label: 'Filial', align: 'center' },
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
    setPage,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [searchItem, setSearchItem] = useState('');
  const [areaList, setAreaList] = useState([]);
  const [branchList, setBranchList] = useState<IBranchList>();
  const { themeStretch } = useSettingsContext();
  const [totalRows, setTotalRows] = useState<any>(0);

  const { partnerId } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const { push } = useRouter();

  const handleSearchChange = (event: any) => {
    setSearchItem(event.target.value);
  };
  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.area.config(paramCase(id)));
  };

  const handleDeleteRow = async (id: string) => {
    const areaId = [id];
    try {
      await deleteArea(areaId);
      getAreaList();

      enqueueSnackbar('Área excluída com sucesso');
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Não foi possível excluir área de atuação', { variant: 'error' });
    }
  };

  const getAreaList = async () => {
    const data = {
      partner_id: partnerId?.partner_id,
      filter: searchItem,
      page: page + 1,
      itensPerPage: rowsPerPage,
    };
    try {
      const response = await getAreaByPartnerId(data);
      setAreaList(response.actuation_areas);
      setTotalRows(response.pagination.totalRows);
      setLoading(false);
      if (response) {
        const branches: any = await getBranch();
        setBranchList(branches);
        console.log(branches);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAreaList();
  }, [searchItem, page, rowsPerPage]);

  return (
    <>
      <Head>
        <title> Parceiro | Áreas de Atuação</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Áreas de Atuação"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Áreas de Atuação',
            },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.area.pointList}
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
              Nova Área
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={searchItem}
            onChange={handleSearchChange}
            placeholder="Pesquisar por nome ou filial..."
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
                  {areaList?.length === 0 && !loading && <TableNoData isNotFound />}

                  {loading && areaList?.length >= 0 ? (
                    <>
                      {[...Array(4)].map((_, index) => (
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
                  ) : (
                    areaList?.map((area: any) => (
                      <AreaTableRow
                        key={area.features[0].properties.actuation_area_id}
                        row={area}
                        selected={selected.includes(area.features[0].properties.actuation_area_id)}
                        onSelectRow={() =>
                          onSelectRow(area.features[0].properties.actuation_area_id)
                        }
                        onEditRow={() =>
                          handleEditRow(area.features[0].properties.actuation_area_id)
                        }
                        onDeleteRow={() =>
                          handleDeleteRow(area.features[0].properties.actuation_area_id)
                        }
                        branchList={branchList}
                        areaList={getAreaList}
                        // onViewRow={() => onSelectRow(product.id)}
                      />
                    ))
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
            // emptyRows={emptyRows}
            // dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

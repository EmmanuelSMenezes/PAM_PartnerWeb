import {
  Card,
  InputAdornment,
  Stack,
  TextField,
  TableContainer,
  Paper,
  TableCell,
  TableRow,
  Skeleton,
  TableBody,
  Table,
  TableHead,
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { useTheme } from '@mui/material/styles';
import { TablePaginationCustom, useTable } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { hexToRgb } from 'src/utils/hexToRgb';
import { Container } from '@mui/system';
import Head from 'next/head';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paramCase } from 'change-case';
import Label from 'src/components/label';
import Iconify from '../../../components/iconify';

ReportsList.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

const relatorios = [
  {
    name: 'Relatório 1',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '1',
  },
  {
    name: 'Relatório 2',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '2',
  },
  {
    name: 'Relatório 3',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '3',
  },
  {
    name: 'Relatório 4',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '4',
  },
  {
    name: 'Relatório 5',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '5',
  },
  {
    name: 'Relatório 6',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '6',
  },
  {
    name: 'Relatório 7',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '7',
  },
  {
    name: 'Relatório 8',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '8',
  },
  {
    name: 'Relatório 9',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '9',
  },
  {
    name: 'Relatório 10',
    date: 'Este relatório trata dos detalhes da transação realizada em 26-07-2023, referente aos itens de venda pão, presunto e queijo...',
    id: '10',
  },
];
// const STATUS_OPTIONS = ['paid', 'unpaid', 'overdue', 'draft'];

export default function ReportsList() {
  const theme = useTheme();

  const { rowsPerPage, onChangeRowsPerPage, onChangePage } = useTable();
  const { push } = useRouter();
  const { themeStretch } = useSettingsContext();

  const TABLE_HEAD = [
    { id: 'reportId', label: 'ID', align: 'center' },
    { id: 'reports', label: 'Nome ', align: 'center' },
    { id: 'date', label: 'Descrição', align: 'center' },
  ];

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);

  const TABS = [
    { value: 'all', label: 'Total de Relatórios', color: 'info', count: relatorios?.length },
  ] as const;

  return (
    <>
      <Head>
        <title> Parceiro | Relatórios</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Relatórios"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Lista de Relatórios' },
          ]}
        />

        <Card sx={{ mb: 2, p: 3 }}>
          <Tabs
            value={() => console.log('oi')}
            onChange={() => console.log('oi')}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <Stack
            direction="row"
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              height: '100%',
              gap: 1,
              mt: 3,
            }}
          >
            <TextField
              sx={{ flex: 1 }}
              fullWidth
              label="Pesquisar por nome"
              placeholder="Relatórios..."
              // value={() => console.log('valor da pesquisa')}
              // onChange={(e) => {
              //   setSearchConsumer(e.target.value);
              // }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Scrollbar>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell
                        key={headCell.id}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && !relatorios && (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <TableRow key={index}>
                          {[...Array(4)].map((__, cellIndex) => (
                            <TableCell key={cellIndex} colSpan={1} align="center">
                              <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
                            </TableCell>
                          ))}
                          <TableCell colSpan={4} align="center">
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

                  {relatorios.map((relatorio: any) => (
                    <TableRow
                      key={relatorio.id}
                      onClick={() => push(PATH_DASHBOARD.reports.details(paramCase(relatorio.id)))}
                      sx={{ cursor: 'pointer' }}
                      hover
                    >
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {relatorio.id}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {relatorio.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {relatorio.date}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>

            <TablePaginationCustom
              labelRowsPerPage="Itens por Página"
              count={relatorios.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              // emptyRows={emptyRows}
              // dense={dense}

              // onChangeDense={onChangeDense}
            />
          </TableContainer>
        </Card>
      </Container>
    </>
  );
}

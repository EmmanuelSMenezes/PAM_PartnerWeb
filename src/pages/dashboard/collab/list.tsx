import { Box, Container, Stack, useTheme } from '@mui/system';
import Head from 'next/head';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import {
  Card,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  Button,
  TableRow,
  Skeleton,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { hexToRgb } from 'src/utils/hexToRgb';
import {
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { getCollaborators, deleteCollaborator, updateCollaborator } from 'src/service/collaborator';
import { ICollaboratorList } from 'src/@types/collaborator';
import { useRouter } from 'next/router';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
import CollabTableRow from './components/CollabTableRow';

const TABLE_HEAD = [
  { id: 'null', label: '' },
  { id: 'nome', label: 'Nome ' },
  { id: 'document', label: 'CPF/CNPJ ' },
  { id: 'email', label: 'E-mail ' },
  { id: 'status', label: 'Status ' },
  { id: 'acoes', label: 'Ações ' },
];

CollabList.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CollabList() {
  const {
    page,
    rowsPerPage,
    selected,
    onSelectRow,
    onChangeDense,
    onChangePage,
    setSelected,
    onSelectAllRows,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const { user, signalRUserConnection } = useAuthContext();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [collabs, setCollabs] = useState<ICollaboratorList>({
    collaborators: [],
    pagination: { totalRows: 0, totalPages: 0 },
  });

  const [filter, setFilter] = useState('');
  const [totalRows, setTotalRows] = useState<any>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCollaboratorsList = async () => {
    const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

    try {
      const response = await getCollaborators(userId, filter, page + 1, rowsPerPage);
      setCollabs(response);
      setTotalRows(response?.pagination?.totalRows);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRows = async (selectedRows: string[]) => {
    const collaboratorsList: any = [];

    selectedRows.forEach((collabId) => {
      collaboratorsList.push(collabId);
    });

    try {
      const response = await deleteCollaborator(selectedRows);

      if (response) {
        setSelected([]);
        getCollaboratorsList();

        if (signalRUserConnection && user) {
          collabs?.collaborators.forEach((collab: any) => {
            collaboratorsList.forEach((collabId: any) => {
              if (collab.collaborator_id === collabId) {
                console.info(`[WS - INVOKE]: DisconnectUser.`);

                signalRUserConnection.invoke('DisconnectUser', collab?.user_id);
              }
            });
          });
        }

        enqueueSnackbar('Colaborador(es) excluido(s) com sucesso');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisableRows = async (selectedRows: string[], collaborator: any = '') => {
    const collaboratorsList: any = [];
    let message: any = 'Colaborador(es) suspenso(s) com sucesso';

    if (collaborator === '') {
      selectedRows.forEach((collabId) => {
        collaboratorsList.push({
          collaborator_id: collabId,
          active: false,
        });
      });
    } else {
      collaboratorsList.push({
        collaborator_id: selectedRows[0],
        active: !collaborator.active,
      });
      message = collaborator.active
        ? 'Colaborador suspenso com sucesso'
        : 'Colaborador ativado com sucesso';
    }

    try {
      const response = await updateCollaborator(collaboratorsList);

      if (response) {
        enqueueSnackbar(message);
        setSelected([]);
        getCollaboratorsList();

        if (signalRUserConnection && user) {
          collabs?.collaborators.forEach((collab: any) => {
            collaboratorsList.forEach((collabId: any) => {
              if (
                collab.collaborator_id === collabId.collaborator_id &&
                collabId.active === false
              ) {
                console.info(`[WS - INVOKE]: DisconnectUser.`);
                console.log(`USER_ID`, collab?.user_id);

                signalRUserConnection.invoke('DisconnectUser', collab?.user_id);
              }
            });
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    getCollaboratorsList();
  }, [filter]);

  useEffect(() => {
    getCollaboratorsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title> Parceiro | Gestão de Colaboradores</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading=" Gestão de Colaboradores "
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Colaboradores',
            },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stack direction="row" sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
            <Button
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
              onClick={() => push(PATH_DASHBOARD.collab.new)}
            >
              Novo Colaborador
            </Button>
          </Stack>
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

          <TableContainer sx={{ minWidth: 800, borderRadius: '8px' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={collabs?.pagination?.totalRows}
              onDeleteRow={() => handleDeleteRows(selected)}
              onDisableRow={() => handleDisableRows(selected)}
              onSelectAllRows={(checked: boolean) =>
                onSelectAllRows(
                  checked,
                  collabs?.collaborators.map((collab: any) => collab?.collaborator_id)
                )
              }
            />

            <Scrollbar>
              <Table sx={{ minWidth: 800 }}>
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

                {isLoading && (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(5)].map((__, cellIndex) => (
                          <TableCell key={cellIndex} colSpan={1} align="center">
                            <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 1 }} />
                          </TableCell>
                        ))}
                        <TableCell colSpan={1} align="center">
                          <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 1 }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}

                <TableBody>
                  {!collabs?.collaborators?.length && !isLoading ? (
                    <TableNoData isNotFound />
                  ) : (
                    collabs?.collaborators?.map((collaborator: any) => (
                      <CollabTableRow
                        key={collaborator.collaborator_id}
                        row={collaborator}
                        selected={selected.includes(collaborator.collaborator_id)}
                        onSelectRow={() => onSelectRow(collaborator.collaborator_id)}
                        onDisableRow={() =>
                          handleDisableRows([collaborator.collaborator_id], collaborator)
                        }
                        onDeleteRow={() => handleDeleteRows([collaborator.collaborator_id])}

                        // onViewRow={() => onSelectRow(product.id)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            labelRowsPerPage="Itens por Página"
            count={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
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

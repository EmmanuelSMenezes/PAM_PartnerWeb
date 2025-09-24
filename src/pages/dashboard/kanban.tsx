/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Container, FormLabel, Stack } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { getOrderByPartner } from 'src/service/order';
import { isEqual } from 'lodash';
import { useStatusContext } from 'src/hooks/useStatusContext';
import { createChat, updateChat } from 'src/redux/slices/chat';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'src/components/snackbar';
import { PATH_DASHBOARD } from '../../routes/paths';
import DashboardLayout from '../../layouts/dashboard';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { SkeletonKanbanColumn } from '../../components/skeleton';
import { KanbanColumn } from '../../sections/@dashboard/kanban';
import { useDispatch, useSelector } from '../../redux/store';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';
import { columnOrder, columnMapping } from '../../utils/columnOrder';

KanbanPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function KanbanPage() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { board } = useSelector((state) => state.kanban);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, partnerId } = useAuthContext();
  const { signalROrderConnection } = useStatusContext();
  const [currentOrder, setCurrentOrder] = useState<any>();
  const today = new Date().toLocaleDateString('pt-BR');
  const userId = user?.isCollaborator ? user?.sponsor_id : user?.user_id;

  const getOrdersList = async () => {
    setLoading(true);
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() - 3);
    const formattedDate = currentUTCDate.toISOString();

    const dataKanban: any = {
      board: {
        cards: [],
        columns: [
          { 
            id: 'd71cb62a-28dd-44a8-a008-9d7d7d1af810',
            name: 'Pendente',
            cardIds: [],
          },
          {
            id: 'c0d9b129-b78b-4d7e-afad-cc378d374e5e',
            name: 'Aceito',
            cardIds: [],
          },
          {
            id: '332de128-06c2-46ba-8d98-ba1df57d88ad',
            name: 'Em Andamento',
            cardIds: [],
          },
          {
            id: 'e04621d0-3997-4c69-9054-a10257602a29',
            name: 'Concluído',
            cardIds: [],
          },
          {
            id: 'c1a38ac0-37d8-450a-aa91-d297e5c97be3',
            name: 'Cancelado',
            cardIds: [],
          },
        ],
        columnOrder: [
          'd71cb62a-28dd-44a8-a008-9d7d7d1af810',
          'c0d9b129-b78b-4d7e-afad-cc378d374e5e',
          '332de128-06c2-46ba-8d98-ba1df57d88ad',
          'e04621d0-3997-4c69-9054-a10257602a29',
          'c1a38ac0-37d8-450a-aa91-d297e5c97be3',
        ],
      },
    };

    const data = {
      partner_id: partnerId?.partner_id,
      filter: '',
      page: 1,
      itensPerPage: 1000,
      start_date: formattedDate,
      end_date: formattedDate,
    };
    try {
      const response = await getOrderByPartner(data);
      setCurrentOrder(response.orders);

      response.orders.sort((a: any, b: any) =>
        a.order_number > b.order_number ? -1 : a.order_number < b.order_number ? 1 : 0
      );

      response.orders.forEach((value: any) => {
        dataKanban?.board.cards.push(value);

        if (value.status_name === 'Pendente') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Pendente'))
          ].cardIds.push(value.order_id);
        }

        if (value.status_name === 'Concluído') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Concluído'))
          ].cardIds.push(value.order_id);
        }

        if (value.status_name === 'Em andamento') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Em Andamento'))
          ].cardIds.push(value.order_id);
        }

        if (value.status_name === 'Aceito') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Aceito'))
          ].cardIds.push(value.order_id);
        }

        if (value.status_name === 'Recusado') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Cancelado'))
          ].cardIds.push(value.order_id);
        }

        if (value.status_name === 'Cancelado pelo cliente') {
          dataKanban?.board.columns[
            dataKanban?.board.columns.findIndex((e: any) => isEqual(e.name, 'Cancelado'))
          ].cardIds.push(value.order_id);
        }
      });

      dispatch(getBoard(dataKanban));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const filteredConsumerId = currentOrder?.filter((order: any) => order.order_id === draggableId);

    const currentIndex = columnOrder.indexOf(source.droppableId);
    const nextColumns = columnOrder.slice(currentIndex + 1);
    if (!nextColumns.includes(destination.droppableId)) {
      const destinationColumnName = columnMapping[destination.droppableId];
      enqueueSnackbar(`Não é possível mover o card para a coluna "${destinationColumnName}"`, {
        variant: 'error',
      });
      return;
    }

    if (
      source.droppableId === 'e04621d0-3997-4c69-9054-a10257602a29' &&
      destination.droppableId === 'c1a38ac0-37d8-450a-aa91-d297e5c97be3'
    ) {
      enqueueSnackbar('Não é possível mover o card de "Concluído" para "Cancelado"', {
        variant: 'error',
      });
      return;
    }

    if (destination.droppableId === '332de128-06c2-46ba-8d98-ba1df57d88ad') {
      const chatParams = {
        order_id: draggableId,
        members: [filteredConsumerId[0]?.consumer?.user_id, userId],
        description: `Pedido nº: ${filteredConsumerId[0].order_number}`,
      };
      await createChat(chatParams);
    }

    // ENCERRAR CHAT AO CONCLUIR PEDIDO
    if (destination.droppableId === 'e04621d0-3997-4c69-9054-a10257602a29') {
      await updateChat({ chat_id: filteredConsumerId[0]?.chat_id, closed_by: userId });
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(board.columnOrder);

      newColumnOrder.splice(source.index, 1);

      newColumnOrder.splice(destination.index, 0, draggableId);

      dispatch(persistColumn(newColumnOrder));
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    const startCardIds = [...start.cardIds];
    startCardIds.splice(source.index, 1);

    const updatedStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = [...finish.cardIds];
    finishCardIds.splice(destination.index, 0, draggableId);
    const updatedFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    dispatch(
      persistCard({
        ...board.columns,
        [updatedStart.id]: updatedStart,
        [updatedFinish.id]: updatedFinish,
      })
    );

    try {
      await signalROrderConnection?.invoke(
        'MoveOrderStatus',
        draggableId,
        destination.droppableId,
        partnerId?.partner_id
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (signalROrderConnection) {
      signalROrderConnection.on('OrderStatusChanged', async ({ order_id, order_status_id }) => {
        console.info(`[WS - ON]: Status Received.`);
        console.info('signal', signalROrderConnection);
        getOrdersList();
      });
    }
  }, [signalROrderConnection]);

  useEffect(() => {
    if (signalROrderConnection) {
      signalROrderConnection.on('RefreshOrderList', async (order) => {
        console.info(`[WS - ON]: Status Received.`);
        console.info('signal', signalROrderConnection);
        getOrdersList();
        console.log('order on', order);
        const newError = order?.Pagseguro?.ErrorPayment?.error_messages;
        if (newError) {
          enqueueSnackbar('Não foi possível estornar o pedido. ', {
            variant: 'error',
          });
        }
      });
    }
  }, [signalROrderConnection]);

  useEffect(() => {
    getOrdersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {' '}
      <Head>
        <title> Parceiro | Kanban</title>
      </Head>
      <Container maxWidth={false} sx={{ height: 1, maxWidth: '1500px' }}>
        <CustomBreadcrumbs
          heading="Pedidos"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Kanban' },
          ]}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <FormLabel component="legend" sx={{ typography: 'body2', mb: 2, mt: -3 }}>
            Os pedidos abaixo são referentes às ocorrências registradas em {today}.
          </FormLabel>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                ref={provided.innerRef}
                direction="row"
                alignItems="flex-start"
                // justifyContent="flex-start"-
                display="flex"
                gap="1rem"
                // overflowY: 'scroll',
                sx={{
                  width: 1,
                  height: 1,
                  overflowX: 'auto',
                  // ...hideScrollbarX,
                }}
              >
                {!board?.columnOrder?.length ? (
                  <SkeletonKanbanColumn />
                ) : (
                  board?.columnOrder?.map((columnId: any, index: any) => (
                    <KanbanColumn
                      index={index}
                      key={columnId}
                      column={board.columns[columnId]}
                      cards={board.cards}
                    />
                  ))
                )}

                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </>
  );
}

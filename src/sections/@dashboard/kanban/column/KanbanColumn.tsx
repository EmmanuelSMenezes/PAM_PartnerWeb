import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Paper, Stack, Typography } from '@mui/material';
import { useDispatch } from '../../../../redux/store';
import { updateColumn } from '../../../../redux/slices/kanban';
import { IKanbanColumn } from '../../../../@types/kanban';
import { useSnackbar } from '../../../../components/snackbar';
import KanbanTaskCard from '../KanbanTaskCard';
import KanbanColumnToolBar from './KanbanColumnToolBar';

type Props = {
  column: any;
  cards: any;
  index: number;
  columns?: IKanbanColumn;
};

export default function KanbanColumn({ column, index, cards, columns }: Props) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateColumn = async (newName: string) => {
    try {
      if (newName !== column.name) {
        dispatch(
          updateColumn(column.id, {
            ...column,
            name: newName,
          })
        );
        enqueueSnackbar('Update success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  function getStatusColor(status: any) {
    switch (status) {
      case 'Aceito':
        return '#d4d4d4';
      case 'Pendente':
        return '#ffe79a';
      case 'Em Andamento':
        return '#bcdbdf';
      case 'Concluído':
        return '#bae5d5';
      case 'Cancelado':
        return '#FA8072';
      default:
        return 'default';
    }
  }

  return (
    <Draggable draggableId={column?.id} index={index} isDragDisabled>
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          ref={provided.innerRef}
          variant="outlined"
          sx={{
            // px: 1,
            // height: 750,
            p: 1,
            borderRadius: 1,
            // overflowY: 'scroll',
            borderStyle: 'dashed',
            bgcolor: getStatusColor(column.name),
            // ...scrollBarStyle,
          }}
        >
          <Stack spacing={3} {...provided.dragHandleProps}>
            <Typography
              variant="h6"
              sx={{
                cursor: 'default',
                mt: 1,
                color: '#FFF',
                textShadow: '0px 1px 3px #696969',
                textAlign: 'center',
              }}
            >
              {column?.name}
            </Typography>

            <Droppable droppableId={column?.id} type="card">
              {(columnProvided) => (
                <Stack
                  ref={columnProvided.innerRef}
                  {...columnProvided.droppableProps}
                  spacing={2}
                  sx={{ width: 250 }}
                >
                  {column?.cardIds?.map((cardId: any, cardIndex: any) => (
                    <KanbanTaskCard key={cardId} index={cardIndex} card={cards[cardId]} />
                  ))}
                  {columnProvided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}

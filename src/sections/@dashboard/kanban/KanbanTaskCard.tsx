import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { getDateOnTimeZone } from 'src/utils/date';
import { IKanbanColumn, IKanbanOrder } from '../../../@types/kanban';

type Props = {
  index: number;
  card: IKanbanOrder;
  columns?: IKanbanColumn;
};

export default function KanbanTaskCard({ card, index, columns }: Props) {
  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  function getStatusColor(status: any) {
    switch (status) {
      case 'Aceito':
        return 'warning';
      case 'Pendente':
        return 'warning';
      case 'Em andamento':
        return 'info';
      case 'Concluído':
        return 'success';
      case 'Cancelado pelo cliente':
        return 'error';
      case 'Recusado':
        return 'error';
      default:
        return 'default';
    }
  }

  const backgroundColor =
    // eslint-disable-next-line no-nested-ternary
    card?.status_name === 'Recusado'
      ? '#cc0000'
      : card?.status_name === 'Aceito'
      ? '#d4d4d4'
      : undefined;

  const textColor = card?.status_name === 'Recusado' ? '#FFF' : undefined;

  return (
    <Draggable draggableId={card?.order_id} index={index}>
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            width: 1,
            borderRadius: 1,
            border: '1px solid #C4C4C4',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: (theme) => theme.customShadows.z1,
            '&:hover': {
              boxShadow: (theme) => theme.customShadows.z20,
            },
          }}
        >
          <Box onClick={handleOpenDetails} sx={{ cursor: 'pointer', p: 1 }}>
            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              Pedido Nº {card?.order_number}
            </Typography>

            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              Data: {new Date(card?.created_at).toLocaleDateString()}
            </Typography>
            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              Horário: {getDateOnTimeZone(new Date(card?.created_at), -3).toLocaleTimeString()}
            </Typography>
            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              Cliente: {card?.consumer?.legal_name}
            </Typography>
            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              Pagamento: {card?.description}
            </Typography>
            <Typography noWrap variant="subtitle2" sx={{ mb: '5px' }}>
              {card?.payment_local_name}
            </Typography>
            <Typography noWrap variant="subtitle2" sx={{ marginBottom: '10px' }}>
              <Chip
                label={`Pedido ${card?.status_name}`}
                color={getStatusColor(card?.status_name)}
                sx={{
                  borderRadius: '6px',
                  backgroundColor,
                  color: textColor,
                }}
              />
            </Typography>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
}

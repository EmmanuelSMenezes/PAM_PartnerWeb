import { useState } from 'react';
import { Box, Paper, Stack, Tooltip, Checkbox, IconButton, InputBase } from '@mui/material';
import { IKanbanCard } from '../../../@types/kanban';
import Iconify from '../../../components/iconify';
import { useDateRangePicker } from '../../../components/date-range-picker';
import KanbanContactsDialog from './KanbanContactsDialog';

type Props = {
  onAddTask: (task: IKanbanCard) => void;
  onCloseAddTask: VoidFunction;
};

export default function KanbanTaskAdd({ onAddTask, onCloseAddTask }: Props) {
  const [name, setName] = useState('');

  const [completed, setCompleted] = useState(false);

  const [openContacts, setOpenContacts] = useState(false);

  const {
    onOpen: onOpenPicker,
    isSelected: isSelectedValuePicker,
    shortLabel,
  } = useDateRangePicker(new Date(), new Date());

  const handleCloseContacts = () => {
    setOpenContacts(false);
  };

  const handleChangeCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompleted(event.target.checked);
  };

  return (
    <div>
      <Paper variant="outlined">
        <InputBase
          multiline
          fullWidth
          placeholder="Novo pedido"
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{ px: 2, pt: 2 }}
        />

        <Stack direction="row" justifyContent="space-between" sx={{ pl: 1, pr: 1.5, pb: 2 }}>
          <Tooltip title="Concluir">
            <Checkbox
              disableRipple
              checked={completed}
              onChange={handleChangeCompleted}
              icon={<Iconify icon="eva:radio-button-off-outline" />}
              checkedIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
            />
          </Tooltip>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {isSelectedValuePicker ? (
              <Box
                onClick={onOpenPicker}
                sx={{
                  cursor: 'pointer',
                  typography: 'caption',
                  '&:hover': { opacity: 0.72 },
                }}
              >
                {shortLabel}
              </Box>
            ) : (
              <Tooltip title="Due date">
                <IconButton size="small" onClick={onOpenPicker}>
                  <Iconify icon="eva:calendar-fill" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Paper>

      <KanbanContactsDialog open={openContacts} onClose={handleCloseContacts} />
    </div>
  );
}

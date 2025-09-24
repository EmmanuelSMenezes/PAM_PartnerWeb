import { useState, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Stack, Drawer, Tooltip, Divider, TextField, Box, IconButton } from '@mui/material';
import { IKanbanCard } from '../../../../@types/kanban';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import DateRangePicker, { useDateRangePicker } from '../../../../components/date-range-picker';
import KanbanInputName from '../KanbanInputName';
import KanbanDetailsToolbar from './KanbanDetailsToolbar';

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 120,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  task: IKanbanCard;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  onDeleteTask: VoidFunction;
};

export default function KanbanDetails({ task, openDetails, onCloseDetails, onDeleteTask }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [liked, setLiked] = useState(false);

  const [taskName, setTaskName] = useState(task?.name);

  const [completed, setCompleted] = useState(task?.completed);

  const [taskDescription, setTaskDescription] = useState(task?.description);

  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    onOpen: onOpenPicker,
    onClose: onClosePicker,
    isSelected: isSelectedValuePicker,
    isError,
    shortLabel,
  } = useDateRangePicker(task?.due[0], task?.due[1]);

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleCompleted = () => {
    setCompleted(!completed);
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const handleChangeTaskName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleChangeTaskDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  };

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      <KanbanDetailsToolbar
        taskName={task?.name}
        fileInputRef={fileInputRef}
        liked={liked}
        completed={completed}
        onLike={handleLiked}
        onAttach={handleClickAttach}
        onDelete={onDeleteTask}
        onCompleted={handleCompleted}
        onCloseDetails={onCloseDetails}
      />

      <Divider />

      <Scrollbar>
        <Stack spacing={3} sx={{ px: 2.5, pt: 3, pb: 5 }}>
          <KanbanInputName placeholder="Novo" value={taskName} onChange={handleChangeTaskName} />

          <Stack direction="row" alignItems="center">
            <StyledLabel> Data de Inclusão </StyledLabel>
            <>
              {isSelectedValuePicker ? (
                <Box
                  onClick={onOpenPicker}
                  sx={{
                    typography: 'body2',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.72 },
                  }}
                >
                  {shortLabel}
                </Box>
              ) : (
                <Tooltip title="Add due date">
                  <IconButton
                    onClick={onOpenPicker}
                    sx={{
                      p: 1,
                      ml: 0.5,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Tooltip>
              )}

              <DateRangePicker
                variant="calendar"
                title="Choose due date"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
                open={openPicker}
                onClose={onClosePicker}
                isSelected={isSelectedValuePicker}
                isError={isError}
              />
            </>
          </Stack>

          <Stack direction="row">
            <StyledLabel> Description </StyledLabel>

            <TextField
              fullWidth
              multiline
              size="small"
              value={taskDescription}
              onChange={handleChangeTaskDescription}
              InputProps={{
                sx: { typography: 'body2' },
              }}
            />
          </Stack>
        </Stack>
      </Scrollbar>

      <Divider />
    </Drawer>
  );
}

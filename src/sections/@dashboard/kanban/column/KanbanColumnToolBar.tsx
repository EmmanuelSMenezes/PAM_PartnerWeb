import { useRef, useState, useEffect } from 'react';
import { Stack, Button, Box } from '@mui/material';
import ConfirmDialog from '../../../../components/confirm-dialog';
import KanbanInputName from '../KanbanInputName';

type Props = {
  columnName: string;
  onUpdate: (name: string) => void;
};

export default function KanbanColumnToolBar({ columnName, onUpdate }: Props) {
  const renameRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(columnName);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const { current } = renameRef;

    if (openPopover) {
      if (current) {
        current.focus();
      }
    }
  }, [openPopover]);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ pt: 3 }}
      >
        <KanbanInputName
          // inputRef={renameRef}
          sx={{ color: (theme) => theme.palette.primary.contrastText }}
          // placeholder="Nova Coluna"
          value={value}
        />
      </Stack>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Excluir"
        content={
          <>
            Tem certeza que deseja excluir a coluna?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> ATENÇÃO: </strong> Todas as atividades relacionadas a coluna também serão
              excluídas.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirm();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}

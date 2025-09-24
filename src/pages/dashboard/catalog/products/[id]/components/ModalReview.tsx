import * as React from 'react';
import { Modal, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import Image from 'next/image';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  title?: string;
  textBody?: string;
  onAccept?: () => void;
  onReject?: () => void;
  currentProduct?: any;
  onSubmit?: any;
  formValues: any;
  image?: string | undefined;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '600px',
  width: '100%',
  bgcolor: '#f2f2f2',
  boxShadow: 24,
  p: 3,
  borderRadius: 1,
  overflowY: 'scroll',
  maxHeight: '670px',
  outline: 0,

  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: (theme: any) => theme.palette.primary.main,
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
};

const ModalReview: React.FC<ModalProps> = ({
  open,
  handleClose,
  title,
  textBody,
  onAccept,
  onReject,
  currentProduct,
  onSubmit,
  formValues,
  image,
}) => (
  <Modal
    open={open}
    onClose={(e, reason) => {
      if (reason && reason === 'backdropClick' && 'escapeKeyDown') return;
      handleClose();
    }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Stack spacing={0}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            Imagem Principal:
          </Typography>
          {image ? (
            <Image
              alt=""
              src={image}
              width={500}
              height={500}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                minWidth: '450px',
                width: '100%',
                borderRadius: '6px',
                border: '2px solid #696969',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '280px',
                width: '300px',
                borderRadius: '6px',
                border: '2px solid black',
              }}
            >
              <Iconify
                icon="material-symbols:image-not-supported-outline-rounded"
                width={48}
                color="#9A9A9A"
                sx={{ marginRight: '5px' }}
              />
            </div>
          )}
        </Box>

        <Stack sx={{ display: 'flex', width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Nome do Serviço/Produto:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {formValues?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Descrição:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word', fontWeight: 700 }}>
              {formValues?.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Preço (sem taxas inclusas):
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word', fontWeight: 700 }}>
              R$
              {formValues?.price.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          gap: 1,
          mt: 3,
        }}
      >
        <Box onClick={handleClose}>
          <LoadingButton
            color="inherit"
            variant="contained"
            sx={{
              bgcolor: (theme) => theme.palette.primary.light,
              color: (theme) => (theme.palette.mode === 'dark' ? 'common.white' : 'common.white'),
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.darker,
                color: (theme) => (theme.palette.mode === 'dark' ? 'common.white' : 'common.white'),
              },
            }}
          >
            Voltar
          </LoadingButton>
        </Box>

        <Box onClick={onSubmit}>
          <LoadingButton
            type="submit"
            color="inherit"
            variant="contained"
            // size="large"
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              color: (theme) => (theme.palette.mode === 'dark' ? 'common.white' : 'common.white'),
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.main,
                color: (theme) => (theme.palette.mode === 'dark' ? 'common.white' : 'common.white'),
              },
            }}
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  </Modal>
);

export default ModalReview;

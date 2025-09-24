import React from 'react';
import { TextField, Stack } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import { maskZipCode } from 'src/utils/formatNumber';

type Props = {
  currentOrder: any;
};
function AddressForm({ currentOrder }: Props) {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: 3 }}>
      <Stack direction={isDesktop ? 'row' : 'column'} sx={{ gap: '1rem' }}>
        <TextField
          label="Endereço"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 3 }}
          value={currentOrder?.consumer?.street}
          disabled
        />
        <TextField
          disabled
          label="Número"
          sx={{ flex: 2 }}
          value={currentOrder?.consumer?.number}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack direction={isDesktop ? 'row' : 'column'} sx={{ gap: '1rem' }}>
        <TextField
          disabled
          label="Complemento"
          sx={{ flex: 1 }}
          value={currentOrder?.consumer?.complement}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          disabled
          value={currentOrder?.consumer?.state}
          label="Estado"
          sx={{ width: '180px ' }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          disabled
          label="Cidade"
          value={currentOrder?.consumer?.city}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          disabled
          label="CEP"
          value={maskZipCode(currentOrder?.consumer?.zip_code)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>
    </Stack>
  );
}

export default AddressForm;

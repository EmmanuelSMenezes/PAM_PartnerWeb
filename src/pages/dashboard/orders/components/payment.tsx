import React from 'react';
import { Checkbox, Chip, FormControlLabel, FormGroup, FormLabel, Stack } from '@mui/material';

type Props = {
  currentOrder: any;
};
function Payment({ currentOrder }: Props) {
  return (
    <FormGroup sx={{ mt: 3 }}>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        Método de Pagamento:
      </FormLabel>

      <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
        <div key={currentOrder?.payments.payment_id}>
          <FormControlLabel
            sx={{ pl: 1 }}
            control={<Checkbox checked />}
            label={currentOrder?.payments[0].description}
          />

          <Chip
            label={currentOrder?.payments[0]?.payment_local_name}
            size="small"
            variant="filled"
            sx={{ borderRadius: '5px' }}
          />
        </div>
      </Stack>
    </FormGroup>
  );
}

export default Payment;

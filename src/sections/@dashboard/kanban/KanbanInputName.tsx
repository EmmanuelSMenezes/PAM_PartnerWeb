// @mui
import { InputBase, InputBaseProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function KanbanInputName({ sx, ...other }: InputBaseProps) {
  return (
    <InputBase
      sx={{
        flexGrow: 1,

        '& .MuiInputBase-input': {
          py: 1,
          borderRadius: 1,
          typography: 'h6',
          // border: `solid 1px transparent`,
          display: 'flex',
          justifyContent: 'center',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',

          // transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
          // '&:hover, &:focus': {
          //   pl: 1,
          //   border: (theme) => `solid 1px ${theme.palette.text.primary}`,
          // },
        },
        ...sx,
      }}
      {...other}
    />
  );
}

import { forwardRef } from 'react';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import { Link, BoxProps, Box } from '@mui/material';
import Image from 'next/image';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    // const PRIMARY_LIGHT = theme.palette.primary.light;

    // const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    const logo = (
      <Box
        component="img"
        src={theme.palette.primary.logo || '/logo/logo.png'}
        sx={{ width: '150px', backgroundColor: '#FFF', height: '100', cursor: 'pointer', ...sx }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NextLink} href="/dashboard" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;

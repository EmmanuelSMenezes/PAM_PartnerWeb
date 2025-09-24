import { Stack } from '@mui/material';
import { StyledRoot, StyledContent } from './styles';

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};

export default function FirstAccessLayout({ children, illustration, title }: Props) {
  return (
    <StyledRoot>
      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}

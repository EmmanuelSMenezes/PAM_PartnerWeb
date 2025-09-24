import { Box, Typography, Card, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ITheme {
  mode: string;
}

export const CardContainer = styled(Card)({
  width: '170px',
  // height: '240px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'default',
});

export const CardImage = styled(Box)({
  width: '100%',
  height: '150px',
  backgroundColor: '#e4e4e4',
  img: {
    borderBottom: '1px solid #E4E4E4',
    width: '100%',
    height: '150px',
  },
});

export const CardTextContainer = styled(Stack)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
});

export const CardTitle = styled(Typography)({
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '12px',
  marginBottom: '10px',
});

export const CardPrice = styled(Typography)({
  fontSize: '12px',
});

export const CardActionContainer = styled(Stack)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '100%',
  marginTop: '10px',
});

export const CardAction = styled(Stack)<ITheme>((props) => ({
  margin: '5px 0',
  button: {
    color: props.mode,
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  },
}));

import React from 'react';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import * as S from '../../../../styles/itemCard';
import Iconify from '../../../../components/iconify';
import { formatValue } from '../../../../utils/formatNumber';

type Props = {
  name: string;
  price: string;
  image: string;
  createProduct: () => void;
};

export default function ItemCard({ name, price, image, createProduct }: Props) {
  const theme = useTheme();
  return (
    <S.CardContainer>
      <S.CardImage>
        {image ? (
          <Image alt="" src={`${image}`} width={500} height={500} />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
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
      </S.CardImage>

      <S.CardTextContainer>
        <S.CardTitle>{name}</S.CardTitle>
        <S.CardPrice>
          <b>Preço mínimo</b>
        </S.CardPrice>
        <S.CardPrice>R$ {formatValue(price)}</S.CardPrice>
      </S.CardTextContainer>

      <S.CardActionContainer>
        <S.CardAction mode={theme.palette.primary.main}>
          <button type="button" onClick={createProduct}>
            <Iconify icon="material-symbols:add-task" width={14} sx={{ marginRight: '5px' }} />
            Adicionar Item
          </button>
        </S.CardAction>
      </S.CardActionContainer>
    </S.CardContainer>
  );
}

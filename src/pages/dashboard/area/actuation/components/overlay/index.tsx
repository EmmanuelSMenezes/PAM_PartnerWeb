import React from 'react';
import { Button } from '@mui/material';
import { Icon } from '@iconify/react';
import * as S from '../../../../../../styles/overlay';

function Overlay({ createArea, handleClearArea, isClear, isDraw }: any) {
  return (
    <S.Container>
      <Button className="btn-style" onClick={() => createArea()} disabled={isDraw}>
        <Icon icon="majesticons:edit-pen-4-line" width="30" height="30" />
      </Button>
      {isClear && (
        <Button className="btn-style" onClick={handleClearArea}>
          <Icon icon="carbon:clean" width="30" height="30" />
        </Button>
      )}
    </S.Container>
  );
}

export default Overlay;

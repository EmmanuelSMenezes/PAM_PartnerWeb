import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  padding: 10px;
  display: flex;
  gap: 5px;
  flex-direction: column;

  .btn-style {
    background-color: #fff;
    width: 50px;
    height: 40px;
    border-radius: 5px;
  }
`;

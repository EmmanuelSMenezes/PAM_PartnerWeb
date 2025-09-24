import styled from 'styled-components';

interface ContainerProps {
  ref?:
    | ((instance: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>
    | null
    | any
    | undefined;
}

export const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

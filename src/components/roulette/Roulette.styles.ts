import styled from 'styled-components';

export const WheelContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  margin: 0 auto;
`;

interface WheelSVGProps {
  rotationAngle: number;
}

export const WheelSVG = styled.svg.attrs<WheelSVGProps>(props => ({
  style: {
    transform: `rotate(${props.rotationAngle}deg)`,
  },
}))<WheelSVGProps>`
  width: 100%;
  height: 100%;
`;

export const Arrow = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid red;
  z-index: 10;
`;

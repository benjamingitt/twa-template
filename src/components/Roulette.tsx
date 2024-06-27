import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Player } from '../game/GameState';

const spin = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const RouletteContainer = styled.div`
  width: 100%;
  height: 60px;
  border: 2px solid #333;
  position: relative;
  overflow: hidden;
`;

const RouletteStrip = styled.div<{ animationDuration: number; stopPosition: number; totalWidth: number }>`
  display: flex;
  height: 100%;
  width: ${props => props.totalWidth}px;
  transition: transform 5s cubic-bezier(0.25, 0.1, 0.25, 1);
  animation: ${props => props.animationDuration > 0 && css`
    ${spin} ${props.animationDuration}s linear infinite
  `};
  animation-play-state: ${props => props.animationDuration === 0 ? 'paused' : 'running'};
  transform: translateX(${props => -props.stopPosition}px);
`;

const RouletteSlice = styled.div<{ color: string; width: number }>`
  height: 100%;
  min-width: ${props => props.width}px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const RouletteArrow = styled.div`
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

export function Roulette({ players, isSpinning, onSpinEnd, winner }: { players: Player[], isSpinning: boolean, onSpinEnd: () => void, winner: Player | null }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [stopPosition, setStopPosition] = useState(0);
  const totalBet = players.reduce((sum, player) => sum + player.bet, 0);
  const stripWidth = 600; // Фиксированная ширина ленты

  useEffect(() => {
    if (isSpinning) {
      setAnimationDuration(0.5); // Начальная скорость вращения
      const accelerationInterval = setInterval(() => {
        setAnimationDuration(prev => Math.max(0.1, prev * 0.9)); // Ускорение вращения
      }, 500);

      setTimeout(() => {
        clearInterval(accelerationInterval);
        if (winner) {
          let position = 0;
          for (const player of players) {
            if (player === winner) {
              position += (player.bet / totalBet) * stripWidth / 2;
              break;
            }
            position += (player.bet / totalBet) * stripWidth;
          }
          setStopPosition(position);
        }
        setAnimationDuration(0); // Остановка вращения
      }, 5000); // Вращение в течение 5 секунд
    } else {
      setAnimationDuration(0);
      setStopPosition(0);
    }
  }, [isSpinning, winner, players, totalBet]);

  useEffect(() => {
    if (!isSpinning && winner) {
      const timer = setTimeout(() => {
        onSpinEnd();
        setStopPosition(0); // Сброс позиции ленты
      }, 15000); // 15 секунд показа победителя
      return () => clearTimeout(timer);
    }
  }, [isSpinning, winner, onSpinEnd]);

  const renderPlayers = isSpinning ? [...players, ...players] : players;

  return (
    <RouletteContainer>
      <RouletteStrip 
        ref={stripRef} 
        animationDuration={animationDuration}
        stopPosition={stopPosition}
        totalWidth={stripWidth * (isSpinning ? 2 : 1)}
      >
        {renderPlayers.map((player, index) => {
          const sliceWidth = (player.bet / totalBet) * stripWidth;
          return (
            <RouletteSlice
              key={`${player.address}-${index}`}
              color={player.color}
              width={sliceWidth}
            >
              {(player.bet / totalBet * 100).toFixed(1)}%
            </RouletteSlice>
          );
        })}
      </RouletteStrip>
      <RouletteArrow />
    </RouletteContainer>
  );
}

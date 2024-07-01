import React from 'react';
import { Player } from '../../game/GameState';
import { WheelSVG } from './Roulette.styles';

interface RouletteWheelProps {
  players: Player[];
  rotationAngle: number;
}

export function RouletteWheel({ players, rotationAngle }: RouletteWheelProps) {
  const totalBet = players.reduce((sum, player) => sum + player.bet, 0);
  let accumulatedAngle = 0;

  return (
    <WheelSVG viewBox="0 0 100 100" rotationAngle={rotationAngle}>
      <circle cx="50" cy="50" r="49" fill="white" stroke="#333" strokeWidth="2" />
      {players.map((player, index) => {
        const percentage = (player.bet / totalBet) * 100;
        const angle = (percentage / 100) * 359.99; // Используем 359.99 вместо 360, чтобы избежать перекрытия
        const startAngle = accumulatedAngle;
        const endAngle = startAngle + angle;
        accumulatedAngle = endAngle;

        const startX = 50 + 49 * Math.cos((startAngle - 90) * Math.PI / 180);
        const startY = 50 + 49 * Math.sin((startAngle - 90) * Math.PI / 180);
        const endX = 50 + 49 * Math.cos((endAngle - 90) * Math.PI / 180);
        const endY = 50 + 49 * Math.sin((endAngle - 90) * Math.PI / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
          `M 50 50`,
          `L ${startX} ${startY}`,
          `A 49 49 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          `Z`
        ].join(' ');

        return (
          <path key={index} d={pathData} fill={player.color} />
        );
      })}
    </WheelSVG>
  );
}

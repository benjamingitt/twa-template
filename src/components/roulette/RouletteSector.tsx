import React from 'react';
import { Player } from '../../game/GameState';

interface RouletteSectorProps {
  player: Player;
  startAngle: number;
  angle: number;
  percentage: number;
}

export function RouletteSector({ player, startAngle, angle, percentage }: RouletteSectorProps) {
  const endAngle = startAngle + angle;
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

  const midAngle = startAngle + angle / 2;
  const textX = 50 + 35 * Math.cos((midAngle - 90) * Math.PI / 180);
  const textY = 50 + 35 * Math.sin((midAngle - 90) * Math.PI / 180);

  return (
    <g>
      <path d={pathData} fill={player.color} />
      {angle > 15 && (
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="4"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${midAngle}, ${textX}, ${textY})`}
        >
          {percentage.toFixed(1)}%
        </text>
      )}
    </g>
  );
}

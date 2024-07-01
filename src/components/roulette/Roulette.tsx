import React from 'react';
import { Player } from '../../game/GameState';
import { WheelContainer, Arrow } from './Roulette.styles';
import { useRouletteAnimation } from './useRouletteAnimation';
import { RouletteWheel } from './RouletteWheel';

interface RouletteProps {
  players: Player[];
  isSpinning: boolean;
  onSpinEnd: () => void;
  winner: Player | null;
}

export function Roulette({ players, isSpinning, onSpinEnd, winner }: RouletteProps) {
  const { rotationAngle, isSpinningComplete } = useRouletteAnimation(isSpinning, winner, players, onSpinEnd);

  return (
    <WheelContainer>
      <RouletteWheel players={players} rotationAngle={rotationAngle} />
      <Arrow />
      {isSpinningComplete && winner && (
        <div>Winner: {winner.address}</div>
      )}
    </WheelContainer>
  );
}

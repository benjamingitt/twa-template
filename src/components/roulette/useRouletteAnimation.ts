import { useState, useEffect, useRef } from 'react';
import { Player } from '../../game/GameState';

const MAX_ROTATIONS = 16;
const ACCELERATION_PHASE = 0.3; // 30% времени на ускорение
const CONSTANT_SPEED_PHASE = 0.4; // 40% времени на постоянную скорость
const DECELERATION_PHASE = 0.3; // 30% времени на замедление

export function useRouletteAnimation(
  isSpinning: boolean,
  winner: Player | null,
  players: Player[],
  onSpinEnd: () => void
) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinningComplete, setIsSpinningComplete] = useState(false);
  const progressRef = useRef(0);
  const winnerAngleRef = useRef(0);

  useEffect(() => {
    if (isSpinning && winner) {
      progressRef.current = 0;
      setIsSpinningComplete(false);
      winnerAngleRef.current = getWinnerAngle(winner, players);
    }
  }, [isSpinning, winner, players]);

  useEffect(() => {
    if (!isSpinning || !winner) return;

    const animate = () => {
      progressRef.current += 0.005; // Увеличивайте это значение для ускорения анимации

      if (progressRef.current >= 1) {
        setRotationAngle(winnerAngleRef.current);
        setIsSpinningComplete(true);
        return;
      }

      let currentRotation;
      if (progressRef.current < ACCELERATION_PHASE) {
        // Фаза ускорения
        currentRotation = easeInQuad(progressRef.current / ACCELERATION_PHASE) * MAX_ROTATIONS * 0.3;
      } else if (progressRef.current < ACCELERATION_PHASE + CONSTANT_SPEED_PHASE) {
        // Фаза постоянной скорости
        currentRotation = MAX_ROTATIONS * 0.3 + 
          ((progressRef.current - ACCELERATION_PHASE) / CONSTANT_SPEED_PHASE) * MAX_ROTATIONS * 0.6;
      } else {
        // Фаза замедления
        const decelerationProgress = (progressRef.current - ACCELERATION_PHASE - CONSTANT_SPEED_PHASE) / DECELERATION_PHASE;
        currentRotation = MAX_ROTATIONS * 0.9 + 
          easeOutQuad(decelerationProgress) * (MAX_ROTATIONS * 0.1);
      }

      setRotationAngle((currentRotation * 360 + winnerAngleRef.current) % 360);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isSpinning, winner, players]);

  useEffect(() => {
    if (isSpinningComplete) {
      onSpinEnd();
    }
  }, [isSpinningComplete, onSpinEnd]);

  return { rotationAngle, isSpinningComplete };
}

function getWinnerAngle(winner: Player, players: Player[]): number {
  const totalBet = players.reduce((sum, player) => sum + player.bet, 0);
  let accumulatedAngle = 0;
  for (const player of players) {
    const playerAngle = (player.bet / totalBet) * 360;
    if (player === winner) {
      return 360 - (accumulatedAngle + playerAngle / 2);
    }
    accumulatedAngle += playerAngle;
  }
  return 0;
}

function easeInQuad(t: number): number {
  return t * t;
}

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

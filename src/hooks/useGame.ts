import { useState, useEffect, useCallback } from 'react';
import { GameState, initialGameState, Player } from '../game/GameState';
import { useTonConnect } from './useTonConnect';
import { Address } from 'ton';

const GAME_DURATION = 30000; // 30 seconds
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#7FDBFF', '#B10DC9', '#FFDC00', '#39CCCC', '#01FF70'];

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { wallet } = useTonConnect();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.gameStartTime && !gameState.winner) {
      timer = setInterval(() => {
        const remaining = Math.max(0, GAME_DURATION - (Date.now() - gameState.gameStartTime!));
        setTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(timer);
          setIsSpinning(true);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState.gameStartTime]);

  const placeBet = useCallback((amount: number) => {
    if (!wallet) return;
    
    const userFriendlyAddress = Address.parse(wallet).toString();
    
    setGameState(prevState => {
      // Создаем нового игрока для каждой ставки
      const newPlayer: Player = { 
        address: userFriendlyAddress, 
        bet: amount, 
        color: COLORS[prevState.players.length % COLORS.length]
      };
      const updatedPlayers = [...prevState.players, newPlayer];
      
      const newTotalBet = prevState.totalBet + amount;
      
      let newGameStartTime = prevState.gameStartTime;
      if (updatedPlayers.length >= 2 && !newGameStartTime) {
        newGameStartTime = Date.now();
      }

      return {
        ...prevState,
        players: updatedPlayers,
        totalBet: newTotalBet,
        gameStartTime: newGameStartTime,
      };
    });
  }, [wallet]);

  const startSpinning = useCallback(() => {
    setIsSpinning(true);
    // Определяем победителя сразу, но не показываем его
    setGameState(prevState => {
      const winner = selectWinner(prevState.players);
      return { ...prevState, winner };
    });
    // Останавливаем вращение через 5 секунд
    setTimeout(() => setIsSpinning(false), 5000);
  }, []);

  const endGame = useCallback(() => {
    setTimeRemaining(null);
    setGameState(initialGameState);
    setIsSpinning(false);
  }, []);
  
  const payoutWinner = useCallback(() => {
    if (gameState.winner) {
      // Здесь должна быть логика для отправки всего банка победителю
      // Например, использование смарт-контракта для перевода средств
      console.log(`Paying out ${gameState.totalBet} TON to ${gameState.winner.address}`);
      
      // После выплаты сбрасываем игру
      endGame();
    }
  }, [gameState.winner, gameState.totalBet, endGame]);
  

  function selectWinner(players: Player[]): Player {
    const totalWeight = players.reduce((sum, player) => sum + player.bet, 0);
    let random = Math.random() * totalWeight;
    
    for (const player of players) {
      random -= player.bet;
      if (random <= 0) {
        return player;
      }
    }
    return players[players.length - 1]; // Fallback
  }

  return { gameState, placeBet, timeRemaining, isSpinning, startSpinning, endGame, payoutWinner };


}

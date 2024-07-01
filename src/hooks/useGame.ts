import { useState, useCallback, useEffect } from 'react';
import { GameState, initialGameState, Player } from '../game/GameState';
import { useTelegramWebApp } from './useTelegramWebApp';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#7FDBFF', '#B10DC9', '#FFDC00', '#39CCCC', '#01FF70'];
const SPIN_DELAY = 15000; // 15 секунд
const WINNER_DISPLAY_TIME = 300000; // 5 минут

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isShowingWinner, setIsShowingWinner] = useState(false);
  const { user } = useTelegramWebApp();
  const [spinTimer, setSpinTimer] = useState<NodeJS.Timeout | null>(null);

  const placeBet = useCallback((amount: number) => {
    if (!user || isSpinning || isShowingWinner) return;
    
    const userIdentifier = user.id.toString();
    
    setGameState(prevState => {
      const existingPlayerIndex = prevState.players.findIndex(p => p.address === userIdentifier);
      let updatedPlayers;
      
      if (existingPlayerIndex !== -1) {
        updatedPlayers = prevState.players.map((player, index) => 
          index === existingPlayerIndex 
            ? { ...player, bet: player.bet + amount }
            : player
        );
      } else {
        const newPlayer: Player = { 
          address: userIdentifier, 
          bet: amount, 
          color: COLORS[prevState.players.length % COLORS.length]
        };
        updatedPlayers = [...prevState.players, newPlayer];
      }
      
      const newTotalBet = prevState.totalBet + amount;

      return {
        ...prevState,
        players: updatedPlayers,
        totalBet: newTotalBet,
      };
    });
  }, [user, isSpinning, isShowingWinner]);

  const startSpinning = useCallback(() => {
    setIsSpinning(true);
    const winner = selectWinner(gameState.players);
    setGameState(prevState => ({ ...prevState, winner: winner }));
  }, [gameState.players]);

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false);
    setIsShowingWinner(true);
    console.log(`Winner: ${gameState.winner?.address}, Amount: ${gameState.totalBet}`);
    
    setTimeout(() => {
      setIsShowingWinner(false);
      setGameState(prevState => ({
        ...initialGameState,
        players: prevState.players.map(player => ({ ...player, bet: 0 }))
      }));
    }, WINNER_DISPLAY_TIME);
  }, [gameState.winner, gameState.totalBet]);

  useEffect(() => {
    const activePlayers = gameState.players.filter(p => p.bet > 0);
    if (activePlayers.length >= 2 && !spinTimer && !isSpinning && !isShowingWinner) {
      const timer = setTimeout(startSpinning, SPIN_DELAY);
      setSpinTimer(timer);
    }

    return () => {
      if (spinTimer) {
        clearTimeout(spinTimer);
        setSpinTimer(null);
      }
    };
  }, [gameState.players, spinTimer, startSpinning, isSpinning, isShowingWinner]);

  function selectWinner(players: Player[]): Player {
    const activePlayers = players.filter(p => p.bet > 0);
    const totalWeight = activePlayers.reduce((sum, player) => sum + player.bet, 0);
    let random = Math.random() * totalWeight;
    
    for (const player of activePlayers) {
      random -= player.bet;
      if (random <= 0) {
        return player;
      }
    }
    return activePlayers[activePlayers.length - 1]; // Fallback
  }

  return { 
    gameState, 
    placeBet, 
    isSpinning, 
    isShowingWinner,
    handleSpinEnd
  };
}

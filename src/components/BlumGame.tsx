import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { Button, Card, FlexBoxCol, FlexBoxRow, Input } from './styled/styled';
import { Roulette } from './roulette/Roulette';
import { useTonConnect } from '../hooks/useTonConnect';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function BlumGame() {
  const { gameState, placeBet, isSpinning, isShowingWinner, handleSpinEnd } = useGame();
  const [betAmount, setBetAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { wallet } = useTonConnect();
  const { user } = useTelegramWebApp();

  const handlePlaceBet = () => {
    const amount = Number(betAmount);
    if (amount > 0) {
      placeBet(amount);
      setBetAmount('');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const activePlayers = gameState.players.filter(p => p.bet > 0);
    if (activePlayers.length >= 2 && !isSpinning && !isShowingWinner) {
      const endTime = Date.now() + 15000;
      interval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 100);
    } else {
      setTimeRemaining(null);
    }
    return () => clearInterval(interval);
  }, [gameState.players, isSpinning, isShowingWinner]);

  const activePlayers = gameState.players.filter(p => p.bet > 0);

  return (
    <Card>
      <h2>Blum Game</h2>
      <FlexBoxCol>
        {user ? (
          <p>Welcome, {user.first_name}!</p>
        ) : (
          <p>Loading Telegram user data...</p>
        )}
        {wallet ? (
          <p>Connected wallet: {shortenAddress(wallet)}</p>
        ) : (
          <p>Please connect your wallet in the Wallet tab.</p>
        )}
        {user && wallet ? (
          <>
            <p>Total Bet: {gameState.totalBet} TON</p>
            {timeRemaining !== null && (
              <p>Time until spin: {(timeRemaining / 1000).toFixed(1)} seconds</p>
            )}
            {isShowingWinner && gameState.winner && (
              <p>
                Winner: {shortenAddress(gameState.winner.address)} (Won {gameState.winner.bet * 0.99} TON)
              </p>
            )}
            <FlexBoxRow>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount"
                disabled={isSpinning || isShowingWinner}
              />
              <Button onClick={handlePlaceBet} disabled={isSpinning || isShowingWinner}>Place Bet</Button>
            </FlexBoxRow> 
            <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
              <Roulette 
                players={gameState.players.filter(p => p.bet > 0)} 
                isSpinning={isSpinning} 
                onSpinEnd={handleSpinEnd}
                winner={gameState.winner}
              />
            </div>

            <h3>Current Bets:</h3>
            {gameState.players.filter(p => p.bet > 0).map((player, index) => (
              <p key={index}>
                {shortenAddress(player.address)}: {player.bet} TON
              </p>
            ))}
          </>
        ) : (
          <p>Please connect your wallet to play.</p>
        )}
      </FlexBoxCol>
    </Card>
  );
}
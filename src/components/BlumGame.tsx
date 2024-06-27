import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { Button, Card, FlexBoxCol, FlexBoxRow, Input } from './styled/styled';
import { Roulette } from './Roulette';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function BlumGame() {
    const { gameState, placeBet, timeRemaining, isSpinning, startSpinning, endGame, payoutWinner } = useGame();
    const [betAmount, setBetAmount] = useState('');
  
    useEffect(() => {
      if (timeRemaining === 0) {
        startSpinning();
      }
    }, [timeRemaining, startSpinning]);
  


  const groupedBets = gameState.players.reduce((acc, player) => {
    if (!acc[player.address]) {
      acc[player.address] = [];
    }
    acc[player.address].push(player.bet);
    return acc;
  }, {} as Record<string, number[]>);

  return (
    <Card>
      <h2>Blum Game</h2>
      <FlexBoxCol>
        <p>Total Bet: {gameState.totalBet} TON</p>
        {timeRemaining !== null && <p>Time Remaining: {(timeRemaining / 1000).toFixed(1)} seconds</p>}
        {gameState.winner && (
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
            disabled={isSpinning}
          />
          <Button onClick={() => placeBet(Number(betAmount))} disabled={isSpinning}>Place Bet</Button>

        </FlexBoxRow>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Roulette 
                players={gameState.players} 
                isSpinning={isSpinning} 
                onSpinEnd={payoutWinner}
                winner={gameState.winner}
                />

            </div>
        <h3>Current Bets:</h3>
        {Object.entries(groupedBets).map(([address, bets]) => (
          <p key={address}>
            {shortenAddress(address)}: {bets.join(', ')} TON
          </p>
        ))}
      </FlexBoxCol>
    </Card>
  );
}

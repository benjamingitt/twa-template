export interface Player {
  address: string;
  bet: number;
  color: string;
}

export interface GameState {
  players: Player[];
  totalBet: number;
  gameStartTime: number | null;
  winner: Player | null;
}

export const initialGameState: GameState = {
  players: [],
  totalBet: 0,
  gameStartTime: null,
  winner: null,
};
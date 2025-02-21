export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface GameState {
  board: string[];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  gameMode: 'cpu' | 'player';
  player1: string;
  player2: string;
  moves: Move[];
}

export interface Move {
  position: number;
  player: string;
  timestamp: number;
}
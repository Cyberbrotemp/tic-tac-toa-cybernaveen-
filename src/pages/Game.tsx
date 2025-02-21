import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';
import { updateUser } from '../utils/storage';
import { GameState, Move } from '../types';
import { MonitorPlay, Users } from 'lucide-react';

const Game = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(''),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    gameMode: 'cpu',
    player1: user?.name || 'Player 1',
    player2: 'CPU',
    moves: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (gameState.gameMode === 'cpu' && gameState.currentPlayer === 'O' && !gameState.winner && !gameState.isDraw) {
      const timer = setTimeout(makeCPUMove, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameMode]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleModeSelect = (mode: 'cpu' | 'player') => {
    if (mode === 'player') {
      const player2Name = prompt('Enter Player 2 name:') || 'Player 2';
      speak(`Welcome ${player2Name}`);
      setGameState({
        ...gameState,
        gameMode: mode,
        player2: player2Name,
        board: Array(9).fill(''),
        currentPlayer: 'X',
        winner: null,
        isDraw: false,
        moves: []
      });
    } else {
      setGameState({
        ...gameState,
        gameMode: mode,
        player2: 'CPU',
        board: Array(9).fill(''),
        currentPlayer: 'X',
        winner: null,
        isDraw: false,
        moves: []
      });
    }
    speak(`${mode === 'cpu' ? 'CPU' : 'Two Player'} mode selected`);
  };

  const handleMove = (index: number) => {
    if (gameState.board[index] || gameState.winner || gameState.isDraw) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const move: Move = {
      position: index,
      player: gameState.currentPlayer,
      timestamp: Date.now()
    };

    const newMoves = [...gameState.moves, move];

    const winner = checkWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== '');

    if (winner || isDraw) {
      handleGameEnd(winner, isDraw);
    }

    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isDraw,
      moves: newMoves
    });

    speak(`${gameState.currentPlayer === 'X' ? gameState.player1 : gameState.player2} placed at position ${index + 1}`);
  };

  const makeCPUMove = () => {
    const emptyCells = gameState.board
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1);

    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      handleMove(randomIndex);
    }
  };

  const handleGameEnd = (winner: string | null, isDraw: boolean) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      gamesPlayed: user.gamesPlayed + 1,
      wins: user.wins + (winner === 'X' ? 1 : 0),
      losses: user.losses + (winner === 'O' ? 1 : 0),
      draws: user.draws + (isDraw ? 1 : 0)
    };

    updateUser(updatedUser);
    
    if (winner) {
      speak(`${winner === 'X' ? gameState.player1 : gameState.player2} wins!`);
    } else if (isDraw) {
      speak("It's a draw!");
    }
  };

  const checkWinner = (board: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto">
      {!gameState.winner && !gameState.isDraw && gameState.board.every(cell => cell === '') && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Select Game Mode</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleModeSelect('cpu')}
              className={`flex items-center justify-center p-4 rounded-lg ${
                gameState.gameMode === 'cpu' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
              } shadow-md hover:shadow-lg transition-all`}
            >
              <MonitorPlay className="h-6 w-6 mr-2" />
              vs CPU
            </button>
            <button
              onClick={() => handleModeSelect('player')}
              className={`flex items-center justify-center p-4 rounded-lg ${
                gameState.gameMode === 'player' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
              } shadow-md hover:shadow-lg transition-all`}
            >
              <Users className="h-6 w-6 mr-2" />
              vs Player
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleMove(index)}
              disabled={!!cell || !!gameState.winner || gameState.isDraw || (gameState.gameMode === 'cpu' && gameState.currentPlayer === 'O')}
              className="aspect-square bg-gray-100 rounded-lg text-4xl font-bold flex items-center justify-center hover:bg-gray-200 transition-colors disabled:cursor-not-allowed"
            >
              <span className={cell === 'X' ? 'text-indigo-600' : 'text-red-500'}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center">
          {gameState.winner ? (
            <p className="text-xl font-bold text-gray-800">
              {gameState.winner === 'X' ? gameState.player1 : gameState.player2} wins!
            </p>
          ) : gameState.isDraw ? (
            <p className="text-xl font-bold text-gray-800">It's a draw!</p>
          ) : (
            <p className="text-xl font-bold text-gray-800">
              {gameState.currentPlayer === 'X' ? gameState.player1 : gameState.player2}'s turn
            </p>
          )}
        </div>

        {(gameState.winner || gameState.isDraw) && (
          <button
            onClick={() => handleModeSelect(gameState.gameMode)}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
import { User, GameState } from '../types';

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const updateUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const saveGameState = (state: GameState): void => {
  localStorage.setItem('gameState', JSON.stringify(state));
};

export const getGameState = (): GameState | null => {
  const state = localStorage.getItem('gameState');
  return state ? JSON.parse(state) : null;
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};
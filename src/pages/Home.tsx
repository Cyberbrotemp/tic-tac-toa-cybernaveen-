import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { GamepadIcon } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <GamepadIcon className="h-24 w-24 text-indigo-600 mb-8" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Game Portal
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Challenge yourself or play against friends!
      </p>
      
      {user ? (
        <button
          onClick={() => navigate('/game')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start Playing
        </button>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
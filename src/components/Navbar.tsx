import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { User, LogOut, GamepadIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8" />
            <span className="text-xl font-bold">Game Portal</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/developers" className="hover:text-indigo-200">Developers</Link>
            {user ? (
              <>
                <Link to="/game" className="hover:text-indigo-200">Play Game</Link>
                <Link to="/profile" className="flex items-center space-x-2 hover:text-indigo-200">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 hover:text-indigo-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link to="/register" className="hover:text-indigo-200">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
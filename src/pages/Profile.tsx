import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { jsPDF } from 'jspdf';
import { Download, Trophy, X, Minus, Key, Trash2 } from 'lucide-react';
import { updateUser, getUsers } from '../utils/storage';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const downloadProfile = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Player Profile', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Games Played: ${user.gamesPlayed}`, 20, 60);
    doc.text(`Wins: ${user.wins}`, 20, 70);
    doc.text(`Losses: ${user.losses}`, 20, 80);
    doc.text(`Draws: ${user.draws}`, 20, 90);

    // Add game history
    doc.text('Recent Games:', 20, 110);
    doc.text(`Total Games: ${user.gamesPlayed}`, 30, 120);
    doc.text(`Win Rate: ${((user.wins / user.gamesPlayed) * 100 || 0).toFixed(1)}%`, 30, 130);
    
    doc.save(`${user.name}-profile.pdf`);
  };

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const updatedUser = {
      ...user,
      password: newPassword
    };

    updateUser(updatedUser);
    setShowPasswordModal(false);
    setNewPassword('');
    toast.success('Password updated successfully');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const users = getUsers().filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(users));
      logout();
      toast.success('Account deleted successfully');
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="opacity-90">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.wins}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <X className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.losses}</div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Minus className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.draws}</div>
              <div className="text-sm text-gray-600">Draws</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-800">{user.gamesPlayed}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={downloadProfile}
              className="flex items-center justify-center w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Profile
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              <Key className="h-5 w-5 mr-2" />
              Change Password
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center justify-center w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
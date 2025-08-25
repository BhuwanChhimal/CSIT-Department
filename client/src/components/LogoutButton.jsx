import React from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '../utils/logout';

const LogoutButton = () => {
  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
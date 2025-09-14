import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Store, Shield } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'store_owner':
        return <Store className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'text-red-600';
      case 'store_owner':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <nav className="gradient-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                Store Rating System
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3 text-white">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full bg-white/20 ${getRoleColor()}`}>
                    {getRoleIcon()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-200 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
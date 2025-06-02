import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Header = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  // Obtener el nombre del usuario desde localStorage o contexto
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || userData.email || 'Usuario');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserName('Usuario');
      }
    } else if (user) {
      setUserName(user.name || user.email || 'Usuario');
    } else {
      setUserName('Usuario');
    }
  }, [user]);

  return (
    <header className="bg-white border-b border-gray-200 z-30 w-full sticky top-0">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu"
                  onClick={() => setShowUserInfo(!showUserInfo)}
                  aria-expanded={showUserInfo}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </button>
              </div>
              
              {/* User name dropdown */}
              {showUserInfo && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user?.email || localStorage.getItem('email') || ''}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Logout button */}
            <div className="ml-3">
              <button
                onClick={() => {
                  // Mostrar toast de confirmación
                  toast.success('Sesión cerrada correctamente', {
                    icon: '👋',
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                    },
                  });
                  // Cerrar sesión y redirigir
                  logout();
                  navigate('/login');
                }}
                className="flex items-center p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                title="Cerrar sesión"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

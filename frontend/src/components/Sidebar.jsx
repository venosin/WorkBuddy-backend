import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ArchiveBoxIcon,
  TagIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ toggleSidebar }) => {
  const location = useLocation();
  const [navigation, setNavigation] = useState([
    { name: 'Dashboard', href: '/', icon: ChartBarIcon, current: false },
    { name: 'Statistics', href: '/statistics', icon: ChartBarIcon, current: false },
    { name: 'Users', href: '/users', icon: UserGroupIcon, current: false },
    { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, current: false },
    { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon, current: false },
    { name: 'Discounts', href: '/discounts', icon: TagIcon, current: false },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon, current: false },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
  ]);

  // Actualizar la navegación actual basado en la ruta
  useEffect(() => {
    setNavigation(prevNavigation => 
      prevNavigation.map(item => ({
        ...item,
        current: item.href === location.pathname
      }))
    );
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col bg-primary">
      {/* Logo y botón de cierre (visible solo en móvil) */}
      <div className="h-16 flex items-center justify-between px-4 bg-primary-light">
        <div className="text-white font-bold text-xl">WorkBuddy</div>
        <button
          type="button"
          className="text-white hover:text-gray-200 lg:hidden"
          onClick={toggleSidebar}
        >
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm md:text-base font-medium rounded-md transition-colors duration-200 ${
                item.current
                  ? 'bg-primary-light text-white'
                  : 'text-gray-100 hover:bg-primary-light hover:text-white'
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 md:h-6 md:w-6 ${
                  item.current ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

import { Link } from 'react-router-dom';
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

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon, current: true },
  { name: 'Statistics', href: '/statistics', icon: ChartBarIcon, current: false },
  { name: 'Users', href: '/users', icon: UserGroupIcon, current: false },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, current: false },
  { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon, current: false },
  { name: 'Discounts', href: '/discounts', icon: TagIcon, current: false },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-primary transform transition-transform duration-300 ease-in-out">
          <div className="h-16 flex items-center justify-between px-4 bg-primary-light">
            <div className="text-white font-bold text-xl">WorkBuddy</div>
            <button
              type="button"
              className="text-white hover:text-gray-200"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    item.current
                      ? 'bg-primary-light text-white'
                      : 'text-gray-100 hover:bg-primary-light hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-6 w-6 ${
                      item.current ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="flex flex-col w-64 fixed h-full">
          <div className="flex flex-col flex-1 bg-primary h-full">
            <div className="h-16 flex items-center justify-center bg-primary-light">
              <div className="text-white font-bold text-xl">WorkBuddy</div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-primary-light text-white'
                        : 'text-gray-100 hover:bg-primary-light hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        item.current ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

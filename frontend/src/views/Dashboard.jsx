import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ArchiveBoxIcon,
  TagIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Utilizamos Icon como componente dinámico para mostrar el ícono correcto
// eslint-disable-next-line no-unused-vars
const DashboardCard = ({ title, description, icon: Icon, to, bgColor }) => {
  return (
    <Link to={to} className="block">
      <div className={`${bgColor} rounded-lg shadow-md p-6 h-full transition-transform hover:scale-105`}>
        <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4">
          <Icon className="h-10 w-10 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-center text-white mb-2">{title}</h3>
        <p className="text-sm text-center text-gray-100">{description}</p>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  
  const dashboardItems = [
    {
      title: 'Estadísticas',
      description: 'Ver métricas clave y tendencias',
      icon: ChartBarIcon,
      to: '/statistics',
      bgColor: 'bg-blue-600'
    },
    {
      title: 'Usuarios',
      description: 'Administrar cuentas de usuarios y permisos',
      icon: UserGroupIcon,
      to: '/users',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Órdenes',
      description: 'Seguimiento y gestión de pedidos',
      icon: ShoppingBagIcon,
      to: '/orders',
      bgColor: 'bg-yellow-500'
    },
    {
      title: 'Inventario',
      description: 'Monitorear niveles de stock y productos',
      icon: ArchiveBoxIcon,
      to: '/inventory',
      bgColor: 'bg-indigo-600'
    },
    {
      title: 'Descuentos',
      description: 'Crear y gestionar ofertas promocionales',
      icon: TagIcon,
      to: '/discounts',
      bgColor: 'bg-green-600'
    },
    {
      title: 'Reportes',
      description: 'Generar informes detallados y análisis',
      icon: DocumentTextIcon,
      to: '/reports',
      bgColor: 'bg-teal-600'
    },
    {
      title: 'Configuración',
      description: 'Configurar ajustes del sistema y preferencias',
      icon: Cog6ToothIcon,
      to: '/settings',
      bgColor: 'bg-gray-600'
    }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">WorkBuddy</h1>
        {user && (
          <p className="text-gray-600 mt-1">Bienvenido, {user.name || user.email}</p>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dashboardItems.map((item) => (
              <DashboardCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
                to={item.to}
                bgColor={item.bgColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

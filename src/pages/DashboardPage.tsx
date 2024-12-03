import React from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import banner from '../assets/images/Untitled-1.png';
import wallpaper from '../assets/images/WallpaperArtboard 1.jpg';
import { DocumentPlusIcon, PencilSquareIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PlusIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const stats = [
  {
    name: 'Total Expedientes',
    value: '156',
    icon: DocumentTextIcon,
    change: '+12.5%',
    changeType: 'increase'
  },
  {
    name: 'En Proceso',
    value: '42',
    icon: ClockIcon,
    change: '-2.3%',
    changeType: 'decrease'
  },
  {
    name: 'Completados',
    value: '89',
    icon: CheckCircleIcon,
    change: '+18.2%',
    changeType: 'increase'
  },
  {
    name: 'Pendientes',
    value: '25',
    icon: ExclamationTriangleIcon,
    change: '-4.1%',
    changeType: 'decrease'
  }
];

const recentActivity = [
  {
    id: 1,
    expediente: 'EXP-2024-001',
    action: 'Creación',
    description: 'Solicitud de permiso de construcción',
    timestamp: '2024-03-15T10:30:00',
    status: 'success',
    tipo: 'creacion'
  },
  {
    id: 2,
    expediente: 'EXP-2024-002',
    action: 'Actualización',
    description: 'Renovación de licencia comercial',
    timestamp: '2024-03-14T15:45:00',
    status: 'warning',
    tipo: 'modificacion'
  },
  {
    id: 3,
    expediente: 'EXP-2024-003',
    action: 'Finalización',
    description: 'Solicitud de evento público',
    timestamp: '2024-03-14T09:15:00',
    status: 'success',
    tipo: 'creacion'
  }
];

const getColorClass = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    'Blanco': 'bg-gray-50 text-gray-900',
    'Negro': 'bg-gray-200 text-gray-900',
    'Rosa': 'bg-pink-50 text-gray-900',
    'Azul': 'bg-blue-50 text-gray-900',
    'Verde': 'bg-green-50 text-gray-900',
    'Amarillo': 'bg-yellow-50 text-gray-900',
    'Naranja': 'bg-orange-50 text-gray-900',
    'Lavanda': 'bg-purple-50 text-gray-900',
    'Menta': 'bg-emerald-50 text-gray-900',
    'Melocotón': 'bg-red-50 text-gray-900'
  };
  return colorMap[color] || 'bg-white text-gray-900';
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm p-6">
        {/* Header con banner */}
        <header className="rounded-lg shadow-md mb-6 overflow-hidden">
          <img 
            src={banner} 
            alt="Banner Municipal" 
            className="w-full h-auto object-cover"
          />
        </header>

        {/* Sección de Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/expedientes/nuevo"
            className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <PlusIcon className="h-6 w-6 text-gray-600 mr-2" />
            <span className="text-gray-700 font-medium">Nuevo Expediente</span>
          </Link>
          <Link
            to="/expedientes"
            className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <TableCellsIcon className="h-6 w-6 text-gray-600 mr-2" />
            <span className="text-gray-700 font-medium">Ver Expedientes</span>
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white/80 backdrop-blur-sm px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-municipal-500 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {item.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`
                            h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${
                              activity.tipo === 'creacion'
                                ? 'bg-green-100 text-green-600'
                                : activity.tipo === 'modificacion'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }
                          `}
                        >
                          {activity.tipo === 'creacion' ? (
                            <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : activity.tipo === 'modificacion' ? (
                            <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <DocumentMagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-700">
                            {activity.description}{' '}
                            <span className="font-medium text-gray-900">
                              {activity.expediente}
                            </span>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={activity.timestamp}>{new Date(activity.timestamp).toLocaleString()}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/expedientes')}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ver todos los expedientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

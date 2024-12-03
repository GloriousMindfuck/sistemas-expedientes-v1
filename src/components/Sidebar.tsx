import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Expedientes', href: '/expedientes', icon: DocumentDuplicateIcon },
  { name: 'Configuración', href: '/configuracion', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-municipal-600">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-4">
            <img
              src="/logo.png"
              alt="Logo Municipalidad"
              className="w-48 object-contain"
            />
          </div>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const current = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center rounded-md px-2 py-2 text-sm font-medium
                  ${
                    current
                      ? 'bg-municipal-700 text-white'
                      : 'text-municipal-100 hover:bg-municipal-700 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-6 w-6 flex-shrink-0
                    ${
                      current
                        ? 'text-white'
                        : 'text-municipal-200 group-hover:text-white'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-municipal-700 p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-municipal-100 hover:bg-municipal-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-6 w-6 text-municipal-200 group-hover:text-white"
            aria-hidden="true"
          />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

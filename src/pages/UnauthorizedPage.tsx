import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <ShieldExclamationIcon className="h-24 w-24 text-red-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Acceso No Autorizado
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="mt-6">
          <Link 
            to="/dashboard" 
            className="btn-primary px-6 py-3 rounded-md"
          >
            Volver al Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

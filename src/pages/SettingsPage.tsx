import React, { useState } from 'react';
import { 
  CogIcon, 
  UserIcon, 
  LockClosedIcon, 
  DatabaseIcon 
} from '@heroicons/react/outline';

import { Logo } from '../components/Logo';  // Importar Logo

const SettingsSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}) => (
  <div className="bg-white rounded-lg shadow-municipal p-6 space-y-4">
    <div className="flex items-center space-x-4 border-b pb-4">
      <div className="bg-municipal-100 text-municipal-600 p-3 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function SettingsPage() {
  const [perfil, setPerfil] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@guardiamitre.gob.ar',
    rol: 'Administrador'
  });

  const [configuracion, setConfiguracion] = useState({
    notificaciones: true,
    temaOscuro: false,
    idioma: 'es'
  });

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleConfiguracionChange = (e) => {
    const { name, checked, type } = e.target;
    setConfiguracion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : e.target.value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-municipal-gradient text-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" className="bg-white p-2 rounded-full" />
            <h1 className="text-3xl font-bold">Configuración</h1>
          </div>
        </div>
        <p className="text-municipal-100">
          Gestiona tu perfil, preferencias y configuración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil de Usuario */}
        <SettingsSection 
          title="Perfil de Usuario" 
          description="Administra tu información personal"
          icon={UserIcon}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={perfil.nombre}
                onChange={handlePerfilChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={perfil.email}
                onChange={handlePerfilChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <input
                type="text"
                name="rol"
                value={perfil.rol}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
              />
            </div>
            <button 
              type="button" 
              className="btn-primary px-4 py-2 rounded-md"
            >
              Guardar Cambios
            </button>
          </form>
        </SettingsSection>

        {/* Configuración del Sistema */}
        <SettingsSection 
          title="Configuración del Sistema" 
          description="Personaliza tu experiencia"
          icon={CogIcon}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Notificaciones</label>
              <input
                type="checkbox"
                name="notificaciones"
                checked={configuracion.notificaciones}
                onChange={handleConfiguracionChange}
                className="form-checkbox text-municipal-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Tema Oscuro</label>
              <input
                type="checkbox"
                name="temaOscuro"
                checked={configuracion.temaOscuro}
                onChange={handleConfiguracionChange}
                className="form-checkbox text-municipal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select
                name="idioma"
                value={configuracion.idioma}
                onChange={handleConfiguracionChange}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Seguridad */}
      <SettingsSection 
        title="Seguridad" 
        description="Gestiona tu contraseña y accesos"
        icon={LockClosedIcon}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <button 
            type="button" 
            className="btn-primary px-4 py-2 rounded-md"
          >
            Cambiar Contraseña
          </button>
        </form>
      </SettingsSection>
    </div>
  );
}

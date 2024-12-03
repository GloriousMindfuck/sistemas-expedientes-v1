import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import LogoMunicipalidad from '../assets/logo-municipalidad.svg';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import { LoginSchema } from '../utils/validations';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const { 
    values, 
    errors, 
    handleChange, 
    validate 
  } = useForm({
    email: '',
    password: ''
  }, LoginSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        const success = await login(values.email, values.password);
        
        if (success) {
          toast.success('Inicio de sesión exitoso');
          navigate('/dashboard');
        } else {
          toast.error('Credenciales inválidas');
        }
      } catch (error) {
        toast.error('Error en el inicio de sesión');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src={LogoMunicipalidad} 
            alt="Logo Municipalidad" 
            className="h-20 w-auto" 
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Gestión de Expedientes
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Municipalidad de Guardia Mitre
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-municipal sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`
                    appearance-none block w-full px-3 py-2 
                    border rounded-md shadow-sm 
                    ${errors.email 
                      ? 'border-red-300 text-red-900' 
                      : 'border-gray-300 text-gray-900'}
                    placeholder-gray-400 focus:outline-none 
                    focus:ring-municipal-500 focus:border-municipal-500
                  `}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  className={`
                    appearance-none block w-full px-3 py-2 
                    border rounded-md shadow-sm 
                    ${errors.password 
                      ? 'border-red-300 text-red-900' 
                      : 'border-gray-300 text-gray-900'}
                    placeholder-gray-400 focus:outline-none 
                    focus:ring-municipal-500 focus:border-municipal-500
                  `}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-municipal-600 focus:ring-municipal-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a 
                  href="#" 
                  className="font-medium text-municipal-600 hover:text-municipal-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-municipal-600 hover:bg-municipal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-municipal-500"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

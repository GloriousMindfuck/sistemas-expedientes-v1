import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  FunnelIcon,  
  ArrowDownTrayIcon,  
  TrashIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import Datepicker from 'react-tailwindcss-datepicker';
import toast from 'react-hot-toast';

import { Logo } from '../components/Logo';
import { ExpedienteService } from '../services/expedienteService';
import { ExpedienteType } from '../schemas/expedienteSchema';
import { getBackgroundColor } from '../styles/colors';

const ExpedientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('fecha');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 9;
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    estado: '',
    montoMinimo: undefined,
    montoMaximo: undefined,
    color: ''
  });

  const { expedientes, totalExpedientes, estadisticas } = useMemo(() => {
    setIsLoading(true);
    const resultado = ExpedienteService.filtrarExpedientes({
      fechaInicio: filtros.fechaInicio ? new Date(filtros.fechaInicio) : undefined,
      fechaFin: filtros.fechaFin ? new Date(filtros.fechaFin) : undefined,
      estado: filtros.estado || undefined,
      montoMinimo: filtros.montoMinimo,
      montoMaximo: filtros.montoMaximo,
      color: filtros.color || undefined,
      page: currentPage,
      itemsPerPage,
      sortField,
      sortDirection
    });
    
    setIsLoading(false);
    return resultado;
  }, [filtros, currentPage, sortField, sortDirection]);

  const totalPages = Math.ceil(totalExpedientes / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFiltroChange = (key: string, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFiltros = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      estado: '',
      montoMinimo: undefined,
      montoMaximo: undefined,
      color: ''
    });
  };

  const handleEliminarExpediente = (id: string) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este expediente?');
    if (confirmacion) {
      const resultado = ExpedienteService.deleteExpediente(id);
      if (resultado) {
        toast.success('Expediente eliminado correctamente');
      } else {
        toast.error('Error al eliminar el expediente');
      }
    }
  };

  const handleExportarCSV = () => {
    ExpedienteService.exportarACSV(expedientes);
    toast.success('Expedientes exportados correctamente');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="medium" className="bg-white p-2 rounded-full" />
            <h1 className="text-3xl font-bold">Expedientes</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/expedientes/nuevo')}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Expediente
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          </div>
        </div>
      </header>

      {showFilters && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas</label>
            <Datepicker
              value={{
                startDate: filtros.fechaInicio,
                endDate: filtros.fechaFin
              }}
              onChange={(value) => {
                handleFiltroChange('fechaInicio', value.startDate);
                handleFiltroChange('fechaFin', value.endDate);
              }}
              primaryColor="blue"
              showShortcuts={true}
              containerClassName="w-full"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Todos</option>
              <option value="Pagado">Pagado</option>
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Faltan Firmas">Faltan Firmas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rango de Montos</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Monto Mínimo"
                value={filtros.montoMinimo || ''}
                onChange={(e) => handleFiltroChange('montoMinimo', e.target.valueAsNumber)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <input
                type="number"
                placeholder="Monto Máximo"
                value={filtros.montoMaximo || ''}
                onChange={(e) => handleFiltroChange('montoMaximo', e.target.valueAsNumber)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <select
              value={filtros.color}
              onChange={(e) => handleFiltroChange('color', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Todos</option>
              <option value="softBlue">Azul Claro</option>
              <option value="softPink">Rosa Claro</option>
              <option value="softGreen">Verde Claro</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button 
              onClick={resetFiltros}
              className="btn-secondary"
            >
              Reiniciar Filtros
            </button>
            <button 
              onClick={handleExportarCSV}
              className="btn-primary flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Expedientes</h3>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Monto Total</h3>
          <p className="text-2xl font-bold text-green-600">
            ${estadisticas.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Pendientes</h3>
          <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Pagados</h3>
          <p className="text-2xl font-bold text-green-600">{estadisticas.pagados}</p>
        </div>
      </div>

      {/* Sorting Options */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => handleSort('fecha')}
            className={`flex items-center px-3 py-2 rounded ${
              sortField === 'fecha' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
            }`}
          >
            Fecha
            <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
          </button>
          <button
            onClick={() => handleSort('monto')}
            className={`flex items-center px-3 py-2 rounded ${
              sortField === 'monto' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
            }`}
          >
            Monto
            <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
          </button>
          <button
            onClick={() => handleSort('estado')}
            className={`flex items-center px-3 py-2 rounded ${
              sortField === 'estado' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
            }`}
          >
            Estado
            <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Expedientes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : expedientes.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron expedientes</p>
          </div>
        ) : (
          expedientes.map((expediente) => (
            <div 
              key={expediente.id_expediente}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105"
              style={{ 
                backgroundColor: getBackgroundColor(expediente.color, 0.1),
                borderTop: `4px solid ${getBackgroundColor(expediente.color)}`
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {expediente.numero_expediente}
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/expedientes/editar/${expediente.id_expediente}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleEliminarExpediente(expediente.id_expediente)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{expediente.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    expediente.estado === 'Pagado' ? 'bg-green-100 text-green-800' :
                    expediente.estado === 'Abierto' ? 'bg-blue-100 text-blue-800' :
                    expediente.estado === 'Cerrado' ? 'bg-gray-100 text-gray-800' :
                    expediente.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {expediente.estado}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${expediente.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalExpedientes)} de {totalExpedientes} expedientes
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-secondary flex items-center"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary flex items-center"
          >
            Siguiente
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpedientesPage;

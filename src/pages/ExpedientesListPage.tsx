import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  DocumentArrowDownIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { ExpedienteService } from '../services/expedienteService';
import { ExpedienteFormData } from '../types';
import { toast } from 'react-hot-toast';
import wallpaper2 from '../assets/images/WallpaperArtboard 2.jpg';

// Mapeo de colores para la visualización
const COLOR_MAP = {
  'Blanco': 'bg-white text-gray-800',
  'Rosa': 'bg-pink-100 text-pink-800',
  'Azul': 'bg-blue-100 text-blue-800',
  'Verde': 'bg-green-100 text-green-800',
  'Amarillo': 'bg-yellow-100 text-yellow-800',
  'Naranja': 'bg-orange-100 text-orange-800',
  'Lavanda': 'bg-purple-100 text-purple-800',
  'Menta': 'bg-emerald-100 text-emerald-800',
  'Melocotón': 'bg-red-100 text-red-800',
  'Gris': 'bg-gray-100 text-gray-800'
};

const ExpedientesListPage: React.FC = () => {
  const [respuesta, setRespuesta] = useState({
    expedientes: [] as ExpedienteFormData[],
    total: 0,
    paginaActual: 1,
    totalPaginas: 0,
    estadisticas: {
      totalMonto: 0,
      distribucionEstados: {} as Record<string, number>,
      distribucionColores: {} as Record<string, number>
    }
  });

  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    color: '',
    pagina: 1,
    limite: 10
  });

  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  useEffect(() => {
    cargarExpedientes();
  }, [filtros]);

  const cargarExpedientes = () => {
    try {
      const resultado = ExpedienteService.buscarExpedientes(filtros);
      setRespuesta(resultado);
    } catch (error) {
      toast.error('Error al cargar los expedientes');
      console.error(error);
    }
  };

  const handleExportarCSV = () => {
    try {
      const blob = ExpedienteService.exportarExpedientes(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expedientes.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error al exportar los expedientes');
    }
  };

  const handleExportarPDF = () => {
    try {
      const blob = ExpedienteService.generarPDFExpedientes(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expedientes.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error al generar el PDF');
    }
  };

  const handleEliminarExpediente = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este expediente?')) {
      ExpedienteService.deleteExpediente(id);
      cargarExpedientes();
    }
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros(prev => ({ ...prev, pagina: nuevaPagina }));
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wallpaper2})` }}>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Expedientes</h1>
            <div className="flex space-x-2">
              <Link 
                to="/expedientes/nuevo" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-municipal-600 hover:bg-municipal-700"
              >
                Nuevo Expediente
              </Link>
              <button 
                onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                {mostrarEstadisticas ? 'Ocultar' : 'Ver'} Estadísticas
              </button>
            </div>
          </div>

          {mostrarEstadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Monto Total</h3>
                <p className="text-2xl font-bold text-municipal-600">
                  ${respuesta.estadisticas.totalMonto.toLocaleString()}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Distribución por Estado</h3>
                {Object.entries(respuesta.estadisticas.distribucionEstados).map(([estado, cantidad]) => (
                  <div key={estado} className="flex justify-between mb-2">
                    <span>{estado}</span>
                    <span className="font-bold">{cantidad}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Distribución por Color</h3>
                {Object.entries(respuesta.estadisticas.distribucionColores).map(([color, cantidad]) => (
                  <div key={color} className="flex justify-between mb-2">
                    <span>{color}</span>
                    <span className="font-bold">{cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex space-x-2">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Buscar expedientes..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                    className="pl-8 pr-4 py-2 border rounded-md w-64"
                  />
                  <MagnifyingGlassIcon className="absolute left-2 top-3 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="">Todos los estados</option>
                  <option value="Abierto">Abierto</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
                <select
                  value={filtros.color}
                  onChange={(e) => setFiltros(prev => ({ ...prev, color: e.target.value }))}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="">Todos los colores</option>
                  {Object.keys(COLOR_MAP).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExportarCSV}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  CSV
                </button>
                <button 
                  onClick={handleExportarPDF}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  PDF
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-4">Número</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {respuesta.expedientes.map(expediente => (
                  <tr key={expediente.id_expediente} className="border-b hover:bg-gray-50">
                    <td className="p-4">{expediente.numero_expediente}</td>
                    <td className="p-4">{expediente.descripcion}</td>
                    <td className="p-4">${expediente.monto.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        expediente.estado === 'Pagado' ? 'bg-green-100 text-green-800' :
                        expediente.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        expediente.estado === 'Cerrado' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {expediente.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${COLOR_MAP[expediente.color as keyof typeof COLOR_MAP]}`}>
                        {expediente.color}
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <Link 
                        to={`/expedientes/${expediente.id_expediente}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleEliminarExpediente(expediente.id_expediente)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 flex justify-between items-center">
              <div>
                Mostrando {(filtros.pagina - 1) * filtros.limite + 1} - 
                {Math.min(filtros.pagina * filtros.limite, respuesta.total)} de {respuesta.total}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => cambiarPagina(filtros.pagina - 1)}
                  disabled={filtros.pagina === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => cambiarPagina(filtros.pagina + 1)}
                  disabled={filtros.pagina === respuesta.totalPaginas}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpedientesListPage;

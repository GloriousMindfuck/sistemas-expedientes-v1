import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Tipos para los filtros y expedientes
type Expediente = {
  id: number;
  numero_expediente: string;
  fecha_inicio: Date;
  fecha_resolucion?: Date | null;
  estado: string;
  descripcion: string;
  monto?: number | null;
};

type Filters = {
  dateRange: {
    start: string | null;
    end: string | null;
  };
  estados: string[];
  searchTerm: string;
};

type ExpedientesFilterProps = {
  expedientes: Expediente[];
  onFilter: (filters: Filters) => void;
  onReset: () => void;
};

export default function ExpedientesFilter({ 
  expedientes, 
  onFilter, 
  onReset 
}: ExpedientesFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      start: null,
      end: null
    },
    estados: [],
    searchTerm: ''
  });

  const estadosExpediente = [
    'PAGADO', 
    'ABIERTO', 
    'CERRADO', 
    'PENDIENTE', 
    'FALTAN_FIRMAS'
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'estados') {
      const selectedEstados = Array.from(
        (e.target as HTMLSelectElement).selectedOptions, 
        option => option.value
      );
      setFilters(prev => ({ ...prev, estados: selectedEstados }));
    } else if (name === 'start' || name === 'end') {
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [name]: value || null
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuickFilter = (type: 'month' | 'quarter') => {
    const today = new Date();
    const dateRange = type === 'month' 
      ? { 
          start: format(startOfMonth(today), 'yyyy-MM-dd'),
          end: format(endOfMonth(today), 'yyyy-MM-dd')
        }
      : {
          start: format(startOfQuarter(today), 'yyyy-MM-dd'),
          end: format(endOfQuarter(today), 'yyyy-MM-dd')
        };

    setFilters(prev => ({ 
      ...prev, 
      dateRange 
    }));
  };

  const handleExport = (type: 'all' | 'filtered') => {
    const dataToExport = type === 'all' 
      ? expedientes 
      : expedientes.filter(exp => {
          const matchesDate = !filters.dateRange.start || !filters.dateRange.end || 
            (new Date(exp.fecha_inicio) >= new Date(filters.dateRange.start) && 
             new Date(exp.fecha_inicio) <= new Date(filters.dateRange.end));
          
          const matchesEstado = filters.estados.length === 0 || 
            filters.estados.includes(exp.estado);
          
          const matchesSearch = !filters.searchTerm || 
            exp.numero_expediente.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            exp.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase());
          
          return matchesDate && matchesEstado && matchesSearch;
        });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expedientes');
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    saveAs(
      new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `Expedientes_${type === 'all' ? 'Todos' : 'Filtrados'}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: null, end: null },
      estados: [],
      searchTerm: ''
    });
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rango de Fechas */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rango de Fechas
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              name="start"
              value={filters.dateRange.start || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Fecha Inicio"
            />
            <input
              type="date"
              name="end"
              value={filters.dateRange.end || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Fecha Fin"
            />
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuickFilter('month')}
              className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            >
              Este Mes
            </button>
            <button
              type="button"
              onClick={() => handleQuickFilter('quarter')}
              className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            >
              Este Trimestre
            </button>
          </div>
        </div>

        {/* Estados */}
        <div className="space-y-2">
          <label htmlFor="estados" className="block text-sm font-medium text-gray-700">
            Estados
          </label>
          <select
            id="estados"
            name="estados"
            multiple
            value={filters.estados}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {estadosExpediente.map(estado => (
              <option key={estado} value={estado}>
                {estado.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div className="space-y-2">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
            Búsqueda
          </label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Buscar por número o descripción"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Exportación */}
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => handleExport('filtered')}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Exportar Filtrados
          </button>
          <button
            type="button"
            onClick={() => handleExport('all')}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Exportar Todo
          </button>
        </div>
      </div>
    </form>
  );
}

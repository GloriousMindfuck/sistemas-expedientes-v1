import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Definición de tipos
type Expediente = {
  id?: number;
  id_expediente?: string;
  numero_expediente: string;
  fecha_ingreso?: Date;
  fecha_inicio: Date;
  fecha_resolucion?: Date | null;
  estado: EstadoExpediente;
  descripcion: string;
  monto?: number | null;
  observaciones?: string;
};

enum EstadoExpediente {
  PAGADO = 'PAGADO',
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
  PENDIENTE = 'PENDIENTE',
  FALTAN_FIRMAS = 'FALTAN_FIRMAS'
}

type ExpedienteFormProps = {
  expediente?: Expediente;
  onClose: () => void;
  onSave: (expediente: Expediente) => void;
};

export default function ExpedienteForm({ 
  expediente, 
  onClose, 
  onSave 
}: ExpedienteFormProps) {
  const [formData, setFormData] = useState<Expediente>({
    numero_expediente: expediente?.numero_expediente || '',
    fecha_inicio: expediente?.fecha_inicio || new Date(),
    fecha_resolucion: expediente?.fecha_resolucion || null,
    estado: expediente?.estado || EstadoExpediente.ABIERTO,
    descripcion: expediente?.descripcion || '',
    monto: expediente?.monto || null,
    observaciones: expediente?.observaciones || ''
  });

  const estadosExpediente = Object.values(EstadoExpediente);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? (value ? parseFloat(value) : null) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validaciones básicas
      if (!formData.numero_expediente.trim()) {
        toast.error('El número de expediente es obligatorio');
        return;
      }

      const endpoint = expediente?.id 
        ? `/api/expedientes/${expediente.id}` 
        : '/api/expedientes';
      
      const method = expediente?.id ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        fecha_inicio: new Date(formData.fecha_inicio),
        fecha_resolucion: formData.fecha_resolucion 
          ? new Date(formData.fecha_resolucion) 
          : null
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar expediente');
      }

      const savedExpediente = await response.json();
      
      toast.success(
        expediente?.id 
          ? 'Expediente actualizado exitosamente' 
          : 'Expediente creado exitosamente'
      );
      
      onSave(savedExpediente);
      onClose();
    } catch (error) {
      toast.error('No se pudo guardar el expediente');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {expediente?.id ? 'Editar Expediente' : 'Nuevo Expediente'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Número de Expediente */}
            <div>
              <label htmlFor="numero_expediente" className="block text-sm font-medium text-gray-700">
                Número de Expediente
              </label>
              <input
                type="text"
                id="numero_expediente"
                name="numero_expediente"
                value={formData.numero_expediente}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                value={format(new Date(formData.fecha_inicio), 'yyyy-MM-dd')}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Fecha de Resolución */}
            <div>
              <label htmlFor="fecha_resolucion" className="block text-sm font-medium text-gray-700">
                Fecha de Resolución (Opcional)
              </label>
              <input
                type="date"
                id="fecha_resolucion"
                name="fecha_resolucion"
                value={formData.fecha_resolucion 
                  ? format(new Date(formData.fecha_resolucion), 'yyyy-MM-dd') 
                  : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {estadosExpediente.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div>
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
                Monto (Opcional)
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                step="0.01"
                value={formData.monto || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Observaciones */}
          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
              Observaciones (Opcional)
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              rows={2}
              value={formData.observaciones || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {expediente?.id ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

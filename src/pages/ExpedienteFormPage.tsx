import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Datepicker from 'react-tailwindcss-datepicker';
import toast from 'react-hot-toast';
import { 
  MunicipalidadColors, 
  generarNumeroExpediente, 
  getBackgroundColor 
} from '../styles/colors';
import { ExpedienteService } from '../services/expedienteService';
import { getExpedienteValidationErrors } from '../schemas/expedienteSchema';
import { Logo } from '../components/Logo'; // Importar Logo
import wallpaper2 from '../assets/images/WallpaperArtboard 12.jpg';
import banner from '../assets/images/Untitled-1.png';

interface PagoDetalle {
  id: string;
  tipo_pago: 'Cheque' | 'Transferencia';
  nombre_pago: string;
  numero_pago: string;
  monto: number;
  fecha_pago: string;
}

interface ExpedienteFormData {
  id_expediente: string;
  numero_expediente: string;
  numero_resolucion?: string;
  fecha_ingreso: string;
  fecha_inicio?: string;
  fecha_resolucion?: string;
  tipo: 'Gasto';
  color: string;
  descripcion: string;
  monto: number;
  estado: 'Pagado' | 'Abierto' | 'Cerrado' | 'Pendiente' | 'Faltan Firmas';
  observaciones?: string;
  pagos: PagoDetalle[];
  color_bibliorato?: string;
}

const COLORES_PASTEL = [
  'Blanco', 'Negro', 'Rosa', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Lavanda', 'Menta', 'Melocotón'
];

const COLORES_EXPEDIENTE = {
  'Blanco': 'bg-white',
  'Rosa': 'bg-pink-100',
  'Azul': 'bg-blue-100',
  'Verde': 'bg-green-100',
  'Amarillo': 'bg-yellow-100',
  'Naranja': 'bg-orange-100',
  'Lavanda': 'bg-purple-100',
  'Menta': 'bg-emerald-100',
  'Melocotón': 'bg-red-100',
  'Gris': 'bg-gray-100'
};

const initialFormState: ExpedienteFormData = {
  id_expediente: '',
  numero_expediente: '',
  numero_resolucion: '',
  fecha_ingreso: new Date().toISOString().split('T')[0],
  fecha_inicio: '',
  fecha_resolucion: '',
  tipo: 'Gasto',
  color: 'Blanco',
  descripcion: '',
  monto: 0,
  estado: 'Abierto',
  observaciones: '',
  pagos: [],
  color_bibliorato: ''
};

const ExpedienteFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing] = useState(!!id);
  const [formData, setFormData] = useState<ExpedienteFormData>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fechas, setFechas] = useState({
    fecha_inicio: null,
    fecha_resolucion: null
  });
  const [backgroundColor, setBackgroundColor] = useState('bg-white');

  useEffect(() => {
    const colorClass = COLORES_EXPEDIENTE[formData.color] || 'bg-white';
    setBackgroundColor(colorClass);
  }, [formData.color]);

  useEffect(() => {
    if (id) {
      const expediente = ExpedienteService.getExpedienteById(id);
      if (expediente) {
        setFormData(expediente);
        setFechas({
          fecha_inicio: expediente.fecha_inicio ? {
            startDate: new Date(expediente.fecha_inicio),
            endDate: new Date(expediente.fecha_inicio)
          } : null,
          fecha_resolucion: expediente.fecha_resolucion ? {
            startDate: new Date(expediente.fecha_resolucion),
            endDate: new Date(expediente.fecha_resolucion)
          } : null
        });
      } else {
        toast.error('Expediente no encontrado');
        navigate('/expedientes');
      }
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? parseFloat(value) || 0 : value
    }));
    validateField(name, value);
  };

  const handleDateChange = (field: 'fecha_inicio' | 'fecha_resolucion', date: any) => {
    setFechas(prev => ({
      ...prev,
      [field]: date
    }));
    validateField(field, date?.startDate?.toISOString().split('T')[0]);
  };

  const handleColorChange = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'Blanco': 'bg-gray-50',
      'Negro': 'bg-gray-200',
      'Rosa': 'bg-pink-50',
      'Azul': 'bg-blue-50',
      'Verde': 'bg-green-50',
      'Amarillo': 'bg-yellow-50',
      'Naranja': 'bg-orange-50',
      'Lavanda': 'bg-purple-50',
      'Menta': 'bg-emerald-50',
      'Melocotón': 'bg-red-50'
    };

    setBackgroundColor(colorMap[colorName] || 'bg-white');
    setFormData(prev => ({
      ...prev,
      color: colorName
    }));
    validateField('color', colorName);
  };

  const agregarPago = () => {
    const nuevoPago: PagoDetalle = {
      id: uuidv4(),
      tipo_pago: 'Cheque',
      nombre_pago: '',
      numero_pago: '',
      monto: 0,
      fecha_pago: new Date().toISOString().split('T')[0]
    };

    setFormData(prev => ({
      ...prev,
      pagos: [...prev.pagos, nuevoPago]
    }));
  };

  const handlePagoChange = (id: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      pagos: prev.pagos.map(pago => 
        pago.id === id 
          ? { ...pago, [field]: field === 'monto' ? parseFloat(value as string) || 0 : value } 
          : pago
      )
    }));
  };

  const eliminarPago = (pagoId: string) => {
    setFormData(prev => ({
      ...prev,
      pagos: prev.pagos.filter(pago => pago.id !== pagoId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar el formulario
      const errores = getExpedienteValidationErrors(formData);
      if (Object.keys(errores).length > 0) {
        setErrors(errores);
        toast.error('Por favor, corrija los errores en el formulario');
        return;
      }

      // Validar que la suma de los pagos coincida con el monto total
      const totalPagos = formData.pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
      if (Math.abs(totalPagos - formData.monto) > 0.01) {
        setErrors(prev => ({
          ...prev,
          pagos: `La suma de los pagos (${totalPagos.toFixed(2)}) debe ser igual al monto total del expediente (${formData.monto.toFixed(2)})`
        }));
        toast.error('La suma de los pagos debe coincidir con el monto total');
        return;
      }

      // Crear o actualizar el expediente
      if (isEditing && id) {
        const result = ExpedienteService.updateExpediente(id, formData);
        if (result) {
          toast.success('Expediente actualizado correctamente');
          navigate('/expedientes');
        }
      } else {
        const result = ExpedienteService.createExpediente(formData);
        if (result) {
          toast.success('Expediente creado correctamente');
          navigate('/expedientes');
        }
      }
    } catch (error) {
      console.error('Error al guardar el expediente:', error);
      toast.error('Error al guardar el expediente');
    }
  };

  const validateField = (field: string, value: string | Date | null) => {
    const validationErrors = getExpedienteValidationErrors(formData);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const mostrarErrorCampo = (campo: string) => {
    return errors[campo] ? (
      <span className="text-red-500 text-sm mt-1">{errors[campo]}</span>
    ) : null;
  };

  // Calcular el total de pagos y el monto restante
  const totalPagos = formData.pagos.reduce((sum: number, pago: any) => sum + (Number(pago.monto) || 0), 0);
  const montoRestante = formData.monto - totalPagos;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wallpaper2})` }}>
      <div className={`min-h-screen backdrop-blur-sm p-6 w-full transition-colors duration-300 ${backgroundColor}`}>
        <header className="bg-blue-100 text-gray-900 p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Editar Expediente' : 'Nuevo Expediente'}
              </h1>
            </div>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 max-w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Expediente
                </label>
                <input
                  type="text"
                  value={formData.id_expediente.substring(0, 8)}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Expediente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="numero_expediente"
                  value={formData.numero_expediente}
                  onChange={handleInputChange}
                  placeholder="Ingrese número de expediente"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.numero_expediente 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {mostrarErrorCampo('numero_expediente')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  value={formData.fecha_ingreso}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                placeholder="Rellenar con nombre de expediente"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.descripcion 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {mostrarErrorCampo('descripcion')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={(e) => handleDateChange('fecha_inicio', e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.fecha_inicio 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {mostrarErrorCampo('fecha_inicio')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Resolución
                </label>
                <input
                  type="date"
                  name="fecha_resolucion"
                  value={formData.fecha_resolucion}
                  onChange={(e) => handleDateChange('fecha_resolucion', e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.fecha_resolucion 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {mostrarErrorCampo('fecha_resolucion')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Resolución
                </label>
                <input
                  type="text"
                  name="numero_resolucion"
                  value={formData.numero_resolucion}
                  onChange={handleInputChange}
                  placeholder="Número de resolución"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color de Expediente <span className="text-red-500">*</span>
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.color 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                >
                  <option value="">Seleccionar color</option>
                  {Object.keys(COLORES_EXPEDIENTE).map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                {mostrarErrorCampo('color')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color de Bibliorato (Opcional)
                </label>
                <select
                  name="color_bibliorato"
                  value={formData.color_bibliorato}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Sin color</option>
                  {COLORES_PASTEL.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="Pagado">Pagado</option>
                  <option value="Abierto">Abierto</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Faltan Firmas">Faltan Firmas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.monto 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  step="0.01"
                />
                {mostrarErrorCampo('monto')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                placeholder="Agregar cualquier información adicional que contenga el expediente"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {/* Sección de Pagos */}
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Pagos</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium">Total Pagos:</span>
                    <span className={`ml-2 ${Math.abs(montoRestante) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                      ${totalPagos.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Monto Restante:</span>
                    <span className={`ml-2 ${Math.abs(montoRestante) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                      ${montoRestante.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={agregarPago}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Agregar Pago
                  </button>
                </div>
              </div>

              {errors.pagos && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.pagos}
                </div>
              )}

              {formData.pagos.map((pago, index) => (
                <div key={pago.id} className="relative grid grid-cols-1 sm:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg mb-4">
                  <button
                    type="button"
                    onClick={() => eliminarPago(pago.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Eliminar pago"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Pago
                    </label>
                    <select
                      value={pago.tipo_pago}
                      onChange={(e) => handlePagoChange(pago.id, 'tipo_pago', e.target.value)}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors[`pagos.${index}.tipo_pago`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Cheque">Cheque</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                    {mostrarErrorCampo(`pagos.${index}.tipo_pago`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de {pago.tipo_pago}
                    </label>
                    <input
                      type="text"
                      value={pago.nombre_pago}
                      onChange={(e) => handlePagoChange(pago.id, 'nombre_pago', e.target.value)}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors[`pagos.${index}.nombre_pago`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {mostrarErrorCampo(`pagos.${index}.nombre_pago`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Número de {pago.tipo_pago}
                    </label>
                    <input
                      type="text"
                      value={pago.numero_pago}
                      onChange={(e) => handlePagoChange(pago.id, 'numero_pago', e.target.value)}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors[`pagos.${index}.numero_pago`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {mostrarErrorCampo(`pagos.${index}.numero_pago`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de {pago.tipo_pago}
                    </label>
                    <input
                      type="date"
                      value={pago.fecha_pago}
                      onChange={(e) => handlePagoChange(pago.id, 'fecha_pago', e.target.value)}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors[`pagos.${index}.fecha_pago`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {mostrarErrorCampo(`pagos.${index}.fecha_pago`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Monto
                    </label>
                    <input
                      type="number"
                      value={pago.monto}
                      onChange={(e) => handlePagoChange(pago.id, 'monto', e.target.value)}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors[`pagos.${index}.monto`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      step="0.01"
                    />
                    {mostrarErrorCampo(`pagos.${index}.monto`)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/expedientes')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-municipal-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-municipal-500"
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpedienteFormPage;

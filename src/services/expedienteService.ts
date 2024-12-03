import { v4 as uuidv4 } from 'uuid';
import { ExpedienteFormData } from '../types';
import { toast } from 'react-hot-toast';

interface FiltrosExpediente {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  color?: string;
  page?: number;
  itemsPerPage?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface EstadisticasExpediente {
  total: number;
  montoTotal: number;
  pendientes: number;
  pagados: number;
}

interface ResultadoFiltrado {
  expedientes: ExpedienteFormData[];
  totalExpedientes: number;
  estadisticas: EstadisticasExpediente;
}

interface RespuestaExpedientes {
  expedientes: ExpedienteFormData[];
  total: number;
  paginaActual: number;
  totalPaginas: number;
  estadisticas: {
    totalMonto: number;
    distribucionEstados: Record<string, number>;
    distribucionColores: Record<string, number>;
  };
}

export class ExpedienteService {
  private static expedientes: ExpedienteFormData[] = [];

  static buscarExpedientes(filtros: FiltrosExpediente = {}): RespuestaExpedientes {
    const {
      fechaInicio,
      fechaFin,
      estado,
      montoMinimo,
      montoMaximo,
      color,
      page = 1,
      itemsPerPage = 10,
      sortField = 'fecha_ingreso',
      sortDirection = 'desc'
    } = filtros;

    // Filtrar expedientes
    let expedientesFiltrados = this.expedientes.filter(exp => {
      const matchFechaInicio = !fechaInicio || new Date(exp.fecha_ingreso) >= fechaInicio;
      const matchFechaFin = !fechaFin || new Date(exp.fecha_ingreso) <= fechaFin;
      const matchEstado = !estado || exp.estado.toLowerCase() === estado.toLowerCase();
      const matchMontoMinimo = montoMinimo === undefined || exp.monto >= montoMinimo;
      const matchMontoMaximo = montoMaximo === undefined || exp.monto <= montoMaximo;
      const matchColor = !color || exp.color.toLowerCase() === color.toLowerCase();

      return matchFechaInicio && matchFechaFin && matchEstado && matchMontoMinimo && matchMontoMaximo && matchColor;
    });

    // Calcular estadísticas
    const estadisticas = {
      totalMonto: expedientesFiltrados.reduce((sum, exp) => sum + exp.monto, 0),
      distribucionEstados: expedientesFiltrados.reduce((acc, exp) => {
        acc[exp.estado] = (acc[exp.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      distribucionColores: expedientesFiltrados.reduce((acc, exp) => {
        acc[exp.color] = (acc[exp.color] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Aplicar ordenamiento
    expedientesFiltrados.sort((a, b) => {
      let valueA = a[sortField as keyof ExpedienteFormData];
      let valueB = b[sortField as keyof ExpedienteFormData];

      if (sortField === 'fecha_ingreso') {
        valueA = new Date(valueA as string).getTime();
        valueB = new Date(valueB as string).getTime();
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Aplicar paginación
    const inicio = (page - 1) * itemsPerPage;
    const fin = inicio + itemsPerPage;
    const expedientesPaginados = expedientesFiltrados.slice(inicio, fin);

    return {
      expedientes: expedientesPaginados,
      total: expedientesFiltrados.length,
      paginaActual: page,
      totalPaginas: Math.ceil(expedientesFiltrados.length / itemsPerPage),
      estadisticas
    };
  }

  // Resto de los métodos existentes...
  static exportarExpedientes(filtros: FiltrosExpediente = {}): Blob {
    const { expedientes } = this.buscarExpedientes(filtros);

    // Crear CSV
    const encabezados = [
      'Número de Expediente', 
      'Descripción', 
      'Fecha de Ingreso', 
      'Monto', 
      'Estado', 
      'Color'
    ];

    const filas = expedientes.map(exp => [
      exp.numero_expediente,
      exp.descripcion,
      exp.fecha_ingreso,
      exp.monto.toString(),
      exp.estado,
      exp.color
    ]);

    const csvContent = [
      encabezados.join(','),
      ...filas.map(fila => fila.map(campo => 
        `"${campo.replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Método para generar PDF
  static generarPDFExpedientes(filtros: FiltrosExpediente = {}): Blob {
    // Implementación simplificada - en un escenario real, usarías una librería como jspdf
    const { expedientes, estadisticas } = this.buscarExpedientes(filtros);

    const contenidoPDF = `
      Reporte de Expedientes
      
      Estadísticas Generales:
      - Total de Expedientes: ${expedientes.length}
      - Monto Total: $${estadisticas.totalMonto.toLocaleString()}

      Distribución por Estado:
      ${Object.entries(estadisticas.distribucionEstados)
        .map(([estado, cantidad]) => `  - ${estado}: ${cantidad}`)
        .join('\n')}

      Distribución por Color:
      ${Object.entries(estadisticas.distribucionColores)
        .map(([color, cantidad]) => `  - ${color}: ${cantidad}`)
        .join('\n')}

      Detalle de Expedientes:
      ${expedientes.map(exp => `
        Número: ${exp.numero_expediente}
        Descripción: ${exp.descripcion}
        Monto: $${exp.monto.toLocaleString()}
        Estado: ${exp.estado}
        Color: ${exp.color}
      `).join('\n\n')}
    `;

    return new Blob([contenidoPDF], { type: 'application/pdf' });
  }

  // Obtener todos los expedientes
  static getExpedientes(): ExpedienteFormData[] {
    try {
      const expedientesJson = localStorage.getItem('municipalidad_expedientes');
      const expedientes = expedientesJson ? JSON.parse(expedientesJson) : [];
      console.log('Expedientes en localStorage:', expedientes);
      return expedientes;
    } catch (error) {
      console.error('Error al obtener expedientes:', error);
      toast.error('Error al cargar los expedientes');
      return [];
    }
  }

  // Obtener un expediente por ID
  static getExpedienteById(id: string): ExpedienteFormData | null {
    try {
      const expedientes = this.getExpedientes();
      return expedientes.find(exp => exp.id_expediente === id) || null;
    } catch (error) {
      console.error('Error al obtener expediente:', error);
      toast.error('Error al cargar el expediente');
      return null;
    }
  }

  // Crear nuevo expediente
  static createExpediente(expedienteData: Omit<ExpedienteFormData, 'id_expediente'>): ExpedienteFormData | null {
    try {
      const expedienteCompleto = {
        ...expedienteData,
        id_expediente: uuidv4()
      };

      const expedientes = this.getExpedientes();
      expedientes.push(expedienteCompleto);
      localStorage.setItem('municipalidad_expedientes', JSON.stringify(expedientes));
      toast.success('Expediente creado correctamente');
      return expedienteCompleto;
    } catch (error) {
      console.error('Error al crear expediente:', error);
      toast.error('Error al crear el expediente');
      return null;
    }
  }

  // Actualizar expediente
  static updateExpediente(id: string, expedienteData: Partial<ExpedienteFormData>): ExpedienteFormData | null {
    try {
      const expedientes = this.getExpedientes();
      const index = expedientes.findIndex(exp => exp.id_expediente === id);

      if (index === -1) {
        throw new Error('Expediente no encontrado');
      }

      const expedienteActualizado = {
        ...expedientes[index],
        ...expedienteData
      };

      expedientes[index] = expedienteActualizado;
      localStorage.setItem('municipalidad_expedientes', JSON.stringify(expedientes));
      toast.success('Expediente actualizado correctamente');
      return expedienteActualizado;
    } catch (error) {
      console.error('Error al actualizar expediente:', error);
      toast.error('Error al actualizar el expediente');
      return null;
    }
  }

  // Eliminar expediente
  static deleteExpediente(id: string): boolean {
    try {
      const expedientes = this.getExpedientes();
      const nuevosExpedientes = expedientes.filter(exp => exp.id_expediente !== id);

      if (expedientes.length === nuevosExpedientes.length) {
        throw new Error('Expediente no encontrado');
      }

      localStorage.setItem('municipalidad_expedientes', JSON.stringify(nuevosExpedientes));
      toast.success('Expediente eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error al eliminar expediente:', error);
      toast.error('Error al eliminar el expediente');
      return false;
    }
  }

  // Filtrar expedientes
  static filtrarExpedientes(filtros: {
    fechaInicio?: Date,
    fechaFin?: Date,
    estado?: string,
    montoMinimo?: number,
    montoMaximo?: number,
    color?: string
  }): ExpedienteFormData[] {
    try {
      let expedientes = this.getExpedientes();

      if (filtros.fechaInicio) {
        expedientes = expedientes.filter(exp => 
          new Date(exp.fecha_ingreso) >= filtros.fechaInicio!
        );
      }

      if (filtros.fechaFin) {
        expedientes = expedientes.filter(exp => 
          new Date(exp.fecha_ingreso) <= filtros.fechaFin!
        );
      }

      if (filtros.estado) {
        expedientes = expedientes.filter(exp => exp.estado === filtros.estado);
      }

      if (filtros.montoMinimo !== undefined) {
        expedientes = expedientes.filter(exp => exp.monto >= filtros.montoMinimo!);
      }

      if (filtros.montoMaximo !== undefined) {
        expedientes = expedientes.filter(exp => exp.monto <= filtros.montoMaximo!);
      }

      if (filtros.color) {
        expedientes = expedientes.filter(exp => exp.color === filtros.color);
      }

      return expedientes;
    } catch (error) {
      console.error('Error al filtrar expedientes:', error);
      toast.error('Error al filtrar los expedientes');
      return [];
    }
  }

  // Exportar a CSV
  static exportarACSV(expedientes: ExpedienteFormData[]): void {
    try {
      const csvContent = [
        'ID,Número Expediente,Número Resolución,Fecha Ingreso,Fecha Inicio,Fecha Resolución,Tipo,Color,Descripción,Monto,Estado,Observaciones',
        ...expedientes.map(exp => 
          `${exp.id_expediente},${exp.numero_expediente},${exp.numero_resolucion || ''},${exp.fecha_ingreso},${exp.fecha_inicio || ''},${exp.fecha_resolucion || ''},${exp.tipo},${exp.color},${exp.descripcion},${exp.monto},${exp.estado},${exp.observaciones || ''}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'expedientes.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Expedientes exportados correctamente');
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      toast.error('Error al exportar los expedientes');
    }
  }

  // Método estático para inicializar datos de ejemplo
  static inicializarDatosEjemplo() {
    try {
      const expedientesExistentes = this.getExpedientes();
      
      console.log('Expedientes existentes:', expedientesExistentes);
      
      if (expedientesExistentes.length === 0) {
        const expedientesIniciales: ExpedienteFormData[] = [
          {
            id_expediente: uuidv4(),
            numero_expediente: '0001/2024',
            numero_resolucion: 'RES-001/2024',
            fecha_ingreso: new Date().toISOString(),
            fecha_inicio: new Date(2024, 0, 15).toISOString(),
            fecha_resolucion: new Date(2024, 1, 1).toISOString(),
            tipo: 'Gasto',
            color: 'softBlue',
            descripcion: 'Compra de materiales de oficina para la municipalidad',
            monto: 75000.50,
            estado: 'Abierto',
            observaciones: 'Compra de útiles de oficina según presupuesto 2024',
            pagos: [
              {
                id: uuidv4(),
                tipo_pago: 'Cheque',
                nombre_pago: 'Librería Municipal',
                numero_pago: '00123456',
                monto: 75000.50
              }
            ],
            color_bibliorato: 'softBlue'
          },
          {
            id_expediente: uuidv4(),
            numero_expediente: '0002/2024',
            numero_resolucion: 'RES-002/2024',
            fecha_ingreso: new Date(2024, 0, 20).toISOString(),
            fecha_inicio: new Date(2024, 0, 20).toISOString(),
            fecha_resolucion: new Date(2024, 1, 5).toISOString(),
            tipo: 'Gasto',
            color: 'softPink',
            descripcion: 'Mantenimiento de vehículos municipales',
            monto: 150000.75,
            estado: 'Pagado',
            observaciones: 'Reparación de vehículos de la flota municipal',
            pagos: [
              {
                id: uuidv4(),
                tipo_pago: 'Transferencia',
                nombre_pago: 'Taller Municipal',
                numero_pago: 'TRF-789012',
                monto: 150000.75
              }
            ],
            color_bibliorato: 'softPink'
          }
        ];

        console.log('Guardando expedientes iniciales:', expedientesIniciales);
        localStorage.setItem('municipalidad_expedientes', JSON.stringify(expedientesIniciales));
        toast.success('Datos de ejemplo inicializados correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar datos de ejemplo:', error);
      toast.error('Error al inicializar los datos de ejemplo');
    }
  }

  // Llamar a este método al inicio de la aplicación
  static inicializar() {
    console.log('Inicializando datos de ejemplo');
    this.inicializarDatosEjemplo();
  }
}

import { z } from 'zod';

// Esquema para tipos de pago
const TipoPagoEnum = z.enum(['Cheque', 'Transferencia']);

// Esquema para estados de expediente
const EstadoExpedienteEnum = z.enum([
  'Pagado', 
  'Abierto', 
  'Cerrado', 
  'Pendiente', 
  'Faltan Firmas'
]);

// Esquema para detalles de pago
export const PagoDetalleSchema = z.object({
  id: z.string().uuid(),
  tipo_pago: TipoPagoEnum,
  nombre_pago: z.string().min(2, "Nombre de pago es requerido"),
  numero_pago: z.string().min(1, "Número de pago es requerido"),
  monto: z.number().positive("Monto debe ser mayor a cero")
});

// Esquema para expediente
export const ExpedienteSchema = z.object({
  id_expediente: z.string().uuid(),
  numero_expediente: z.string().regex(
    /^\d{4}\/\d{4}$/, 
    "Número de expediente debe estar en formato 0001/2024"
  ),
  numero_resolucion: z.string().optional(),
  fecha_ingreso: z.string().datetime(),
  fecha_inicio: z.string().datetime().optional(),
  fecha_resolucion: z.string().datetime().optional(),
  tipo: z.literal('Gasto'),
  color: z.string(),
  descripcion: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  monto: z.number().positive("Monto total debe ser mayor a cero"),
  estado: EstadoExpedienteEnum,
  observaciones: z.string().optional(),
  pagos: z.array(PagoDetalleSchema).min(1, "Debe haber al menos un pago"),
  color_bibliorato: z.string().optional()
}).refine(data => {
  // Validación de montos: suma de pagos debe ser igual al monto total
  const totalPagos = data.pagos.reduce((sum, pago) => sum + pago.monto, 0);
  return Math.abs(totalPagos - data.monto) < 0.01; // Pequeño margen de error para flotantes
}, {
  message: "La suma de pagos debe ser igual al monto total del expediente"
});

// Tipos para TypeScript
export type ExpedienteType = z.infer<typeof ExpedienteSchema>;
export type PagoDetalleType = z.infer<typeof PagoDetalleSchema>;
export type EstadoExpediente = z.infer<typeof EstadoExpedienteEnum>;
export type TipoPago = z.infer<typeof TipoPagoEnum>;

// Función de validación
export function validateExpediente(data: unknown): data is ExpedienteType {
  try {
    ExpedienteSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Validación de expediente fallida:', error);
    return false;
  }
}

// Función para obtener errores de validación
export function getExpedienteValidationErrors(data: unknown): string[] {
  try {
    ExpedienteSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => err.message);
    }
    return ['Error de validación desconocido'];
  }
}

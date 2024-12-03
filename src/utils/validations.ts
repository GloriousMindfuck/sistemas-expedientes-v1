import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
});

export const ExpedienteSchema = z.object({
  numero: z.string().min(1, 'Número de expediente es requerido'),
  asunto: z.string().min(5, 'Asunto debe tener al menos 5 caracteres'),
  descripcion: z.string().optional(),
  fechaInicio: z.date(),
  estado: z.enum(['PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'ARCHIVADO']),
  responsable: z.string().min(1, 'Responsable es requerido')
});

export const UserProfileSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.enum(['ADMIN', 'USER', 'VIEWER'])
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual es requerida'),
  newPassword: z.string()
    .min(6, 'Nueva contraseña debe tener al menos 6 caracteres')
    .max(50, 'Nueva contraseña no puede tener más de 50 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

interface ExpedienteData {
  numero_expediente: string;
  descripcion: string;
  fecha_inicio?: string;
  fecha_resolucion?: string;
  color: string;
  monto: number;
  [key: string]: any;
}

interface ValidationErrors {
  numero_expediente?: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_resolucion?: string;
  color?: string;
  monto?: string;
  [key: string]: string | undefined;
}

export const getExpedienteValidationErrors = (data: ExpedienteData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar número de expediente
  if (!data.numero_expediente?.trim()) {
    errors.numero_expediente = 'El número de expediente es obligatorio';
  }

  // Validar descripción
  if (!data.descripcion?.trim()) {
    errors.descripcion = 'La descripción es obligatoria';
  }

  // Validar fechas individualmente
  if (data.fecha_inicio) {
    const inicio = new Date(data.fecha_inicio);
    if (isNaN(inicio.getTime())) {
      errors.fecha_inicio = 'La fecha de inicio no es válida';
    }
  }
  
  if (data.fecha_resolucion) {
    const resolucion = new Date(data.fecha_resolucion);
    if (isNaN(resolucion.getTime())) {
      errors.fecha_resolucion = 'La fecha de resolución no es válida';
    }
  }

  // Validar color
  if (!data.color) {
    errors.color = 'El color del expediente es obligatorio';
  }

  // Validar monto
  if (typeof data.monto !== 'number' || isNaN(data.monto) || data.monto <= 0) {
    errors.monto = 'El monto debe ser un número mayor a 0';
  }

  return errors;
};

export const validateExpedienteForm = (formData: any) => {
  const errors: { [key: string]: string } = {};

  // Validaciones básicas
  if (!formData.numero_expediente) {
    errors.numero_expediente = 'El número de expediente es requerido';
  }

  if (!formData.descripcion) {
    errors.descripcion = 'La descripción es requerida';
  }

  if (!formData.monto || formData.monto <= 0) {
    errors.monto = 'El monto debe ser mayor a 0';
  }

  // Validar que la suma de los pagos sea igual al monto total
  if (formData.pagos && formData.pagos.length > 0) {
    const sumaPagos = formData.pagos.reduce((sum: number, pago: any) => sum + (Number(pago.monto) || 0), 0);
    if (Math.abs(sumaPagos - formData.monto) > 0.01) { // Usando 0.01 para manejar errores de redondeo
      errors.pagos = `La suma de los pagos (${sumaPagos.toFixed(2)}) debe ser igual al monto total del expediente (${formData.monto.toFixed(2)})`;
    }
  }

  // Validar fechas
  if (formData.fecha_inicio && formData.fecha_resolucion) {
    const inicio = new Date(formData.fecha_inicio);
    const resolucion = new Date(formData.fecha_resolucion);
    if (inicio > resolucion) {
      errors.fecha_resolucion = 'La fecha de resolución no puede ser anterior a la fecha de inicio';
    }
  }

  // Validar pagos individuales
  if (formData.pagos) {
    formData.pagos.forEach((pago: any, index: number) => {
      if (!pago.nombre_pago) {
        errors[`pagos.${index}.nombre_pago`] = 'El nombre del pago es requerido';
      }
      if (!pago.numero_pago) {
        errors[`pagos.${index}.numero_pago`] = 'El número de pago es requerido';
      }
      if (!pago.monto || pago.monto <= 0) {
        errors[`pagos.${index}.monto`] = 'El monto del pago debe ser mayor a 0';
      }
      if (!pago.fecha_pago) {
        errors[`pagos.${index}.fecha_pago`] = 'La fecha del pago es requerida';
      }
    });
  }

  return errors;
};

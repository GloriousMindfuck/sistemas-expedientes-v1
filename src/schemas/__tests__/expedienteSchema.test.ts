import { ExpedienteSchema, PagoDetalleSchema } from '../expedienteSchema';
import { v4 as uuidv4 } from 'uuid';

describe('ExpedienteSchema', () => {
  const validExpediente = {
    id_expediente: uuidv4(),
    numero_expediente: `EXP-2024${new Date().getMonth() + 1}${new Date().getDate()}-001`,
    fecha_ingreso: new Date().toISOString().split('T')[0],
    tipo: 'Gasto',
    color: 'Azul Claro',
    descripcion: 'Compra de materiales de oficina para la municipalidad',
    monto: 5000,
    estado: 'Abierto'
  };

  it('valida un expediente correcto', () => {
    const result = ExpedienteSchema.safeParse(validExpediente);
    expect(result.success).toBe(true);
  });

  it('rechaza expediente con monto negativo', () => {
    const invalidExpediente = { ...validExpediente, monto: -100 };
    const result = ExpedienteSchema.safeParse(invalidExpediente);
    expect(result.success).toBe(false);
  });

  it('rechaza descripción muy corta', () => {
    const invalidExpediente = { ...validExpediente, descripcion: 'Corto' };
    const result = ExpedienteSchema.safeParse(invalidExpediente);
    expect(result.success).toBe(false);
  });
});

describe('PagoDetalleSchema', () => {
  const validPago = {
    id: uuidv4(),
    tipo_pago: 'Cheque',
    numero_pago: 'CH-001',
    monto: 1000
  };

  it('valida un pago correcto', () => {
    const result = PagoDetalleSchema.safeParse(validPago);
    expect(result.success).toBe(true);
  });

  it('rechaza pago con monto negativo', () => {
    const invalidPago = { ...validPago, monto: -500 };
    const result = PagoDetalleSchema.safeParse(invalidPago);
    expect(result.success).toBe(false);
  });
});

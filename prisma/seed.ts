import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear estados iniciales
  const estados = [
    { nombre: 'En Trámite' },
    { nombre: 'Finalizado' },
    { nombre: 'Archivado' },
    { nombre: 'Cancelado' }
  ];

  for (const estado of estados) {
    await prisma.estado.upsert({
      where: { nombre: estado.nombre },
      update: {},
      create: estado,
    });
  }

  // Crear tipos iniciales
  const tipos = [
    { nombre: 'Solicitud' },
    { nombre: 'Reclamo' },
    { nombre: 'Informe' },
    { nombre: 'Proyecto' }
  ];

  for (const tipo of tipos) {
    await prisma.tipo.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo,
    });
  }

  // Crear algunos expedientes de ejemplo
  const estadoEnTramite = await prisma.estado.findUnique({ where: { nombre: 'En Trámite' } });
  const tipoSolicitud = await prisma.tipo.findUnique({ where: { nombre: 'Solicitud' } });

  if (estadoEnTramite && tipoSolicitud) {
    await prisma.expediente.create({
      data: {
        numero: '001',
        anio: 2024,
        fecha: new Date(),
        asunto: 'Solicitud de permiso de construcción',
        estadoId: estadoEnTramite.id,
        tipoId: tipoSolicitud.id,
        iniciador: 'Juan Pérez',
        observaciones: 'Pendiente de revisión técnica'
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

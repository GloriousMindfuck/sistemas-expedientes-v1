import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4567;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de Expedientes
app.get('/api/expedientes', async (req, res) => {
  try {
    const expedientes = await prisma.expediente.findMany({
      include: {
        estado: true,
        tipo: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
    res.json(expedientes);
  } catch (error) {
    console.error('Error al obtener expedientes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los expedientes' });
  }
});

app.post('/api/expedientes', async (req, res) => {
  try {
    const { numero, anio, fecha, asunto, estadoId, tipoId, iniciador, observaciones } = req.body;
    
    const nuevoExpediente = await prisma.expediente.create({
      data: {
        numero,
        anio,
        fecha: new Date(fecha),
        asunto,
        estadoId,
        tipoId,
        iniciador,
        observaciones
      },
      include: {
        estado: true,
        tipo: true
      }
    });

    res.status(201).json(nuevoExpediente);
  } catch (error) {
    console.error('Error al crear expediente:', error);
    res.status(500).json({ error: 'No se pudo crear el expediente' });
  }
});

app.get('/api/estados', async (req, res) => {
  try {
    const estados = await prisma.estado.findMany();
    res.json(estados);
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({ error: 'No se pudieron obtener los estados' });
  }
});

app.get('/api/tipos', async (req, res) => {
  try {
    const tipos = await prisma.tipo.findMany();
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los tipos' });
  }
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;

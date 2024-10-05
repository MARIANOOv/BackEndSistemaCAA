import { Router } from 'express';
import { valorationController } from '../controllers/valorationController.js';

export const valorationRouter = Router();

// Crear una nueva valoración
valorationRouter.post('/', valorationController.create);

// Obtener todas las valoraciones
valorationRouter.get('/', valorationController.getAll);

// Obtener valoraciones por ID de Sala
valorationRouter.get('/sala/:idSala', valorationController.getBySala);

// Obtener valoraciones por ID de Cubículo
valorationRouter.get('/cubiculo/:idCubiculo', valorationController.getByCubiculo);

// Obtener una valoración por ID de Encuesta
valorationRouter.get('/:idEncuesta', valorationController.getById);

// Eliminar una valoración por ID
valorationRouter.delete('/:idEncuesta', valorationController.delete);

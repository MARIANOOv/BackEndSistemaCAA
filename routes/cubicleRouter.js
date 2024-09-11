import {Router} from 'express';
import {cubicleController} from "../controllers/cubicleController.js";

export const cubicleRouter = Router();

cubicleRouter.get('/', cubicleController.getAll)
cubicleRouter.post('/',cubicleController.create)

cubicleRouter.get('/:id',cubicleController.getById)
cubicleRouter.delete('/:id',cubicleController.delete)
cubicleRouter.patch('/:id',cubicleController.update)
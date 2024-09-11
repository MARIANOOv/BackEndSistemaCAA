import {Router} from 'express';
import {resourceController} from "../controllers/resourceController.js";

export const resourceRouter = Router();

resourceRouter.get('/', resourceController.getAll)
resourceRouter.post('/',resourceController.create)

resourceRouter.get('/:id',resourceController.getById)
resourceRouter.delete('/:id',resourceController.delete)
resourceRouter.patch('/:id',resourceController.update)
import {Router} from 'express';
import {roleController} from "../controllers/roleController.js";



export const roleRouter = Router();

roleRouter.get('/', roleController.getAll)
roleRouter.post('/',roleController.create)
roleRouter.get('/:nombre',roleController.getByRoleName)

roleRouter.get('/:id',roleController.getById)
roleRouter.delete('/:id',roleController.delete)
roleRouter.patch('/:id',roleController.update)
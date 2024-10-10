import {Router} from 'express';
import {categoryController} from "../controllers/categoryController.js";
import {roleController} from "../controllers/roleController.js";
import {roleRouter} from "./roleRouter.js";



export const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAll)
categoryRouter.post('/',categoryController.create)
categoryRouter.get('/:nombre',categoryController.getByCategoryName)

categoryRouter.get('/:id',categoryController.getById)
categoryRouter.delete('/:id',categoryController.delete)
categoryRouter.patch('/:id',categoryController.update)
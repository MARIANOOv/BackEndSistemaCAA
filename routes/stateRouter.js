import {Router} from 'express';
import {StateController} from "../controllers/stateController.js";
import {roleController} from "../controllers/roleController.js";
import {roleRouter} from "./roleRouter.js";



export const stateRouter = Router();

stateRouter.get('/', StateController.getAll)
stateRouter.post('/',StateController.create)
stateRouter.get('/:nombre',StateController.getByStateName)

stateRouter.get('/:id',StateController.getById)
stateRouter.delete('/:id',StateController.delete)
stateRouter.patch('/:id',StateController.update)
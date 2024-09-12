import {Router} from 'express';
import {StateController} from "../controllers/stateController.js";



export const stateRouter = Router();

stateRouter.get('/', StateController.getAll)
stateRouter.post('/',StateController.create)

stateRouter.get('/:id',StateController.getById)
stateRouter.delete('/:id',StateController.delete)
stateRouter.patch('/:id',StateController.update)
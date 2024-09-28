import {Router} from 'express';
import {cubicleController} from "../controllers/cubicleController.js";
import {RoomController} from "../controllers/roomController.js";
import {roomRouter} from "./roomRouter.js";

export const cubicleRouter = Router();

cubicleRouter.get('/', cubicleController.getAll)
cubicleRouter.post('/',cubicleController.create)

cubicleRouter.get('/:id',cubicleController.getById)
cubicleRouter.delete('/:id',cubicleController.delete)

cubicleRouter.patch('/cubicleLock',cubicleController.lock)
cubicleRouter.patch('/cubicleUnLock',cubicleController.unLock)
cubicleRouter.patch('/:id',cubicleController.update)
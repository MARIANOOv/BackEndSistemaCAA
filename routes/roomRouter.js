import {Router} from 'express';
import {RoomController} from "../controllers/roomController.js";



export const roomRouter = Router();

roomRouter.get('/', RoomController.getAll)
roomRouter.get('/:id',RoomController.getById)
roomRouter.get('/getName/:id',RoomController.getNameById)

roomRouter.post('/',RoomController.create)

roomRouter.delete('/:id',RoomController.delete)

roomRouter.patch('/roomLock',RoomController.lock)
roomRouter.patch('/roomUnLock',RoomController.unLock)
roomRouter.patch('/:id',RoomController.update)


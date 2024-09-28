import {Router} from 'express';
import {RoomController} from "../controllers/roomController.js";



export const roomRouter = Router();

roomRouter.get('/', RoomController.getAll)
roomRouter.post('/',RoomController.create)

roomRouter.get('/:id',RoomController.getById)
roomRouter.get('/getName/:id',RoomController.getNameById)
roomRouter.delete('/:id',RoomController.delete)
roomRouter.patch('/:id',RoomController.update)
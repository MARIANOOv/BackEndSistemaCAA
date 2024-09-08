import {Router} from 'express';
import {RoomController} from "../controllers/roomController.js";


export const roomRouter = Router();

roomRouter.get('/', RoomController.getAll)
roomRouter.post('/',)

roomRouter.get('/:id',)
roomRouter.delete('/:id',)
roomRouter.patch('/:id',)
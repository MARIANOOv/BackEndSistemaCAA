import {Router} from 'express';
import {RoomController} from "../controllers/roomController.js";
import {RoomModel} from "../models/mysql/roomModel.js";


export const roomRouter = Router();

roomRouter.get('/', RoomController.getAll)
roomRouter.post('/',RoomController.create)

roomRouter.get('/:id',RoomController.getById)
roomRouter.delete('/:id',RoomController.delete)
roomRouter.patch('/:id',RoomController.update)
import {Router} from 'express';
import {reservationController} from "../controllers/reservationController.js";



export const reservationRouter = Router();

reservationRouter.get('/', reservationController.getAll)
reservationRouter.post('/',reservationController.create)
reservationRouter.get('/getbyDate/:date',reservationController.getByDate)
reservationRouter.get('/getbyRoomId/:roomId',reservationController.getByRoomId)
reservationRouter.get('/getbyCubicleId/:cubicleId',reservationController.getByCubicleId)
reservationRouter.get('/getbyUserId/:userId',reservationController.getByUserId)

reservationRouter.get('/:id',reservationController.getById)
reservationRouter.delete('/:id',reservationController.delete)
reservationRouter.patch('/:id',reservationController.update)

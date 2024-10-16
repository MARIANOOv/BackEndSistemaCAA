import {Router} from 'express';
import {applicationController} from "../controllers/applicationController.js";



export const applicationRouter = Router();

applicationRouter.get('/', applicationController.getAll)
applicationRouter.post('/',applicationController.create)
applicationRouter.get('/getbyUserId/:userId',applicationController.getByUserId)
applicationRouter.post('/sendJustification',applicationController.sendJustificationEmail)

applicationRouter.get('/:id',applicationController.getById)
applicationRouter.delete('/:id',applicationController.delete)
applicationRouter.patch('/:id',applicationController.update)
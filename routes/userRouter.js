import {Router} from 'express';
import {userController} from "../controllers/userController.js";



export const userRouter = Router();

userRouter.get('/', userController.getAll)
userRouter.post('/',userController.create)
userRouter.post('/login',userController.login)

userRouter.get('/:id',userController.getById)
userRouter.delete('/:id',userController.delete)
userRouter.patch('/:id',userController.update)
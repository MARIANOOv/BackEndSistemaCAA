import {Router} from 'express';
import {assetController} from "../controllers/assetController.js";



export const assetRouter = Router();

assetRouter.get('/', assetController.getAll)
assetRouter.post('/',assetController.create)
assetRouter.get('/category/:id',assetController.getByCategory)

assetRouter.get('/:id',assetController.getById)
assetRouter.delete('/:id',assetController.delete)
assetRouter.patch('/:id',assetController.update)
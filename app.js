import express from 'express';
import { roomRouter } from "./routes/roomRouter.js";
import { cubicleRouter } from "./routes/cubicleRouter.js";
import { resourceRouter } from "./routes/resourceRouter.js";
import { roleRouter } from "./routes/roleRouter.js";
import { categoryRouter } from "./routes/categoryRouter.js";
import { stateRouter } from "./routes/stateRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { assetRouter } from "./routes/assetRouter.js";
import { applicationRouter } from "./routes/applicationRouter.js";
import { reservationRouter } from "./routes/reservationRouter.js";
import cors from 'cors';
import multer from 'multer';
import cron from 'node-cron';
import {notificationService} from './services/notificationService.js';
import { valorationRouter } from './routes/valorationRouter.js'

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());
app.disable('x-powered-by');

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use('/rooms', upload.single('imagen'), roomRouter);
app.use('/cubicles', cubicleRouter);
app.use('/resources', resourceRouter);
app.use('/roles', roleRouter);
app.use('/categories', categoryRouter);
app.use('/cubicles', cubicleRouter);
app.use('/resources', resourceRouter);
app.use('/states', stateRouter);
app.use('/users', userRouter);
app.use('/assets', assetRouter);
app.use('/applications', applicationRouter);
app.use('/reservations', reservationRouter);
app.use('/valorations', valorationRouter);


cron.schedule('13 1 * * *', () => {
    notificationService();
}, {
    timezone: "America/Costa_Rica"
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

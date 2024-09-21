import express from 'express';
import {roomRouter} from "./routes/roomRouter.js";
import {cubicleRouter} from "./routes/cubicleRouter.js";
import {resourceRouter} from "./routes/resourceRouter.js";
import {roleRouter} from "./routes/roleRouter.js";
import {categoryRouter} from "./routes/categoryRouter.js";
import {stateRouter} from "./routes/stateRouter.js";
import {userRouter} from "./routes/userRouter.js";
import {assetRouter} from "./routes/assetRouter.js";
import {applicationRouter} from "./routes/applicationRouter.js";
import {reservationRouter} from "./routes/reservationRouter.js";
import cors from 'cors';
import multer from 'multer'; // Importa multer

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());
app.disable('x-powered-by');

// Configura multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Usar memoryStorage para almacenar el archivo en la memoria
const upload = multer({ storage });

// Usa 'upload.single('imagen')' en la ruta de creación de salas para manejar la imagen
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

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

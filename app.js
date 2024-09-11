import express from 'express';
import {roomRouter} from "./routes/roomRouter.js";
import {cubicleRouter} from "./routes/cubicleRouter.js";

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/rooms', roomRouter);
app.use('/cubicles', cubicleRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`hhtp://localhost:${PORT}`);
})
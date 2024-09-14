import express from 'express';
import {roomRouter} from "./routes/roomRouter.js";
import {cubicleRouter} from "./routes/cubicleRouter.js";
import {resourceRouter} from "./routes/resourceRouter.js";
import {roleRouter} from "./routes/roleRouter.js";
import {categoryRouter} from "./routes/categoryRouter.js";
import {stateRouter} from "./routes/stateRouter.js";
import {userRouter} from "./routes/userRouter.js";
import {assetRouter} from "./routes/assetRouter.js";

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/rooms', roomRouter);
app.use('/cubicles', cubicleRouter);
app.use('/resources', resourceRouter);
app.use('/roles', roleRouter);
app.use('/categories', categoryRouter);
app.use('/cubicles', cubicleRouter);
app.use('/resources', resourceRouter);
app.use('/states', stateRouter);
app.use('/users', userRouter);
app.use('/assets', assetRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`hhtp://localhost:${PORT}`);
})
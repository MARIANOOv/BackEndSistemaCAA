import express from 'express';
import {roomRouter} from "./routes/roomRouter.js";
import {roleRouter} from "./routes/roleRouter.js";
import {categoryRouter} from "./routes/categoryRouter.js";

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/rooms', roomRouter);
app.use('/roles', roleRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`hhtp://localhost:${PORT}`);
})
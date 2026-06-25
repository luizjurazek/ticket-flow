import express from 'express';
import cors from 'cors';
import { globalRouter } from './shared/infra/http/routes/routes';
import { errorHandler } from './shared/infra/http/middlewares/ErrorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalRouter);
app.use(errorHandler);

export { app };

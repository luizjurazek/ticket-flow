import express from 'express';
import cors from 'cors';
import { globalRouter } from './shared/infra/http/routes/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalRouter);

export { app };
import express from 'express';
import cors from 'cors';
import { globalRouter } from './shared/infra/http/routes/routes';
import { errorHandler } from './shared/infra/http/middlewares/error-handler.middleware';
import { httpLogger } from '@/shared/infra/http/middlewares/http-logger.middleware';
import { requestContext } from '@/shared/infra/http/middlewares/request-context.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestContext);
app.use(httpLogger);
app.use(globalRouter);
app.use(errorHandler);

export { app };

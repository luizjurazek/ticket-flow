import 'dotenv/config';
import { app } from './app';
import { StructuredLogger } from '@/shared/infra/logger/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  StructuredLogger.info(`Server running on port ${PORT}`);
});

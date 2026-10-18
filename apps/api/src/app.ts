import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { registerApiRoutes } from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  registerApiRoutes(app);

  return app;
}

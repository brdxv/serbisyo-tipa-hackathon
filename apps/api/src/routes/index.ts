import type { Express } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';

export function registerApiRoutes(app: Express) {
  app.use('/api/health', healthRouter);
}

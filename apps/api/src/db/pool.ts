import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const db = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL })
  : null;

export function requireDb() {
  if (!db) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return db;
}

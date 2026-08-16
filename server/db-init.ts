/**
 * Run once to create the database tables:
 *   npm run db:init
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

async function init() {
  console.log('Creating tables...');
  await pool.query(sql);
  console.log('Done.');
  await pool.end();
}

init().catch(err => {
  console.error('Init failed:', err.message);
  process.exit(1);
});

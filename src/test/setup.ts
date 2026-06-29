import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', quiet: true });

// Default value to avoid code breaking
process.env.GEMINI_API_KEY ??= 'fake-key-for-testing';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/ticket_flow_test';

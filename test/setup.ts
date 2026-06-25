import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Default value to avoid code breaking
process.env.GEMINI_API_KEY = 'fake-key-for-testing';
process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake';

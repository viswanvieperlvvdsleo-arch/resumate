import { config } from 'dotenv';

// Load .env file first
config();
// Then, load .env.local to override any values from .env
// This is the standard Next.js behavior.
config({ path: '.env.local', override: true });

import '@/ai/flows/ai-resume-review.ts';

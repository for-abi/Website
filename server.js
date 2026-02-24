import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import stripeRoutes from './routes/stripe.js';

dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

// Stripe webhook requires the raw request body — must be registered before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/stripe', stripeRoutes);

// Serve static frontend from public/
app.use(express.static(join(__dirname, 'public')));

app.listen(process.env.PORT || 5000, () => console.log('Server running'));

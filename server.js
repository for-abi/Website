import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import stripeRoutes from './routes/stripe.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/stripe', stripeRoutes);

app.listen(process.env.PORT || 5000, ()=>console.log('Server running'));

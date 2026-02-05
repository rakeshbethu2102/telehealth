import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import updateRoutes from './routes/updateRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/profiles', profileRoutes);

// Static files for frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Basic Route
app.get('/', (req, res) => {
  res.send('Telehealth Backend API is running...');
});

// For any other route, serve the index.html from the frontend build
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Database Connection
if (process.env.NODE_ENV !== 'production') {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
       console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB (Production)'))
    .catch(err => console.error('DB Error:', err));
}

export default app;

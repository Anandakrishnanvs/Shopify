
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins to prevent Vercel deployment CORS blocks
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5001
  });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Global error handlers to prevent app from completely crashing
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
});
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

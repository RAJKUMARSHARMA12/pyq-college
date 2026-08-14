import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB, isMongoConnected } from './config/db.js';

// Modular Versioned Routes Hub
import apiRouter from './routes/index.js';
import pyqRoutesLegacy from './routes/pyqRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

// Global Error Middlewares
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Uploaded PYQ PDF & Image Files
const uploadsDirectory = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

// Versioned API Pipeline (/api/v1/...)
app.use('/api', apiRouter);

// Legacy aliases for backward compatibility
app.use('/api/pyqs', pyqRoutesLegacy);
app.use('/api/items', itemRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    version: 'v1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: isMongoConnected(),
      mode: isMongoConnected() ? 'MongoDB' : 'In-Memory Fallback',
    },
  });
});

// Root API Welcome route
app.get('/', (req, res) => {
  res.send('ProRes MERN PYQ Versioned API Server is running...');
});

// Unmatched Route Handler (404)
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

// Listen locally if not running inside Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ProRes Versioned PYQ API Server running on http://localhost:${PORT}`);
    console.log(`📡 API v1 Routes available at http://localhost:${PORT}/api/v1/pyqs`);
  });
}

export default app;

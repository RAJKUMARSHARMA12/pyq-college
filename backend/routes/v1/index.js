import express from 'express';
import authRoutes from './auth.routes.js';
import pyqRoutes from './pyq.routes.js';
import adminRoutes from './admin.routes.js';
import catalogRoutes from './catalog.routes.js';
import solutionRoutes from './solution.routes.js';
import commentRoutes from './comment.routes.js';

const v1Router = express.Router();

// Mount API v1 Modular Routes
v1Router.use('/auth', authRoutes);
v1Router.use('/pyqs', pyqRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/catalog', catalogRoutes);
v1Router.use('/', solutionRoutes);
v1Router.use('/', commentRoutes);

export default v1Router;

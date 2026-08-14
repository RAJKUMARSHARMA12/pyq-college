import express from 'express';
import v1Router from './v1/index.js';

const apiRouter = express.Router();

// Mount Version 1 API
apiRouter.use('/v1', v1Router);

// Backwards-compatible aliases for legacy routes
apiRouter.use('/auth', v1Router);

export default apiRouter;

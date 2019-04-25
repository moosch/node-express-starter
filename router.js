import express from 'express';

// Import more routers here
import userRouter from './src/rest/user/user.router';

const router = express.Router();

// Add more routers here
router.use('/users', userRouter);

export default router;

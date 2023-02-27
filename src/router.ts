/**
 * The top level router is where we attach request middleware that is app-wide, not route-specific.
 * For example, top level error catcher, request logger, and security checkers.
 * This is also where we register path routers.
 */
import { Router } from 'express';
import userRouter from '@/routes/users';
import authRouter from '@/routes/authentication';

type Routers = { [key: string]: Router }

const router = Router();

const routers: Routers = {
  '/user': userRouter,
  '/auth': authRouter,
};

Object.keys(routers).forEach((route: string) => {
  router.use(route, routers[route]);
});

// Middleware-specific error handlers
// router.use();

export default router;

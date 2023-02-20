/**
 * The top level router is where we attach request middleware that is app-wide, not route-specific.
 * For example, top level error catcher, request logger, and security checkers.
 * This is also where we register path routers.
 */
import { Router } from 'express';
import userRouter from '@/routes/users';

type Routers = { [key: string]: Router }

const router = Router();

const routers: Routers = {
  '/users': userRouter,
};

Object.keys(routers).forEach((route: string) => {
  router.use(route, routers[route]);
});

export default router;

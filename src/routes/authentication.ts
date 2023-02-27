import express from 'express';
import controllers from '@/controllers';
import validation from '@/components/validation';
import contextMiddleware from '@/middleware/context.middleware';

const router = express.Router();

router.post(
  '/signup',
  validation.authentication.signup,
  controllers.authentication.signup,
);

router.post(
  '/signin',
  validation.authentication.signin,
  controllers.authentication.signin,
);

router.post(
  '/refresh',
  ...contextMiddleware,
  validation.authentication.refresh,
  controllers.authentication.refresh,
);

router.post(
  '/logout',
  ...contextMiddleware,
  controllers.authentication.logout,
);

router.use('/', controllers.authentication.errorHandler);

export default router;

import express, { NextFunction } from 'express';
import controllers from '@/controllers';
import validation from '@/components/validation';

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
  validation.authentication.refresh,
  controllers.authentication.refresh,
);

router.post(
  '/logout',
  controllers.authentication.logout,
);

// Handle any expected errors from this router
router.use(controllers.users.errorHandler);

export default router;

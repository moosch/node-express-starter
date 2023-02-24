import express from 'express';
import contextMiddleware from '@/middleware/context.middleware';
import controllers from '@/controllers';
import validation from '@/components/validation';

const router = express.Router();

// Handled by /auth/signup
// router.get(
//   '/:id',
//   validation.users.find,
//   contextMiddleware,
//   controllers.users.find,
// );

router.post(
  '/',
  validation.users.create,
  contextMiddleware,
  controllers.users.create,
);

router.patch(
  '/:id',
  validation.users.update,
  contextMiddleware,
  controllers.users.update,
);

router.delete(
  '/:id',
  validation.users.remove,
  contextMiddleware,
  controllers.users.remove,
);

// Handle any expected errors from this router
router.use(controllers.users.errorHandler);

export default router;

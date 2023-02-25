import express from 'express';
import contextMiddleware from '@/middleware/context.middleware';
import controllers from '@/controllers';
import validation from '@/components/validation';
import context from '@/middleware/context.middleware';

const router = express.Router();

router.get(
  '/:id',
  context,
  validation.users.find,
  contextMiddleware,
  controllers.users.find,
);

router.patch(
  '/:id',
  context,
  validation.users.update,
  contextMiddleware,
  controllers.users.update,
);

router.delete(
  '/:id',
  context,
  validation.users.remove,
  contextMiddleware,
  controllers.users.remove,
);

// Handle any expected errors from this router
router.use(controllers.users.errorHandler);

export default router;

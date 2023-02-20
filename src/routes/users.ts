/**
 * Routers are used to define which routes are available and how
 * the requests are handled.
 * 
 * Routes generally have validation and context middleware
 * before passing the request on to the controller layer.
 * 
 * It also must define a domain-specific error handler.
 */

import express from 'express';
import contextMiddleware from '../component/context/context.middleware';
import controllers from '../controllers';
import validation from '../validation';

const router = express.Router();

router.get(
  '/:id',
  validation.users.get,
  contextMiddleware,
  controllers.users.get,
);

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
  validation.users.delete,
  contextMiddleware,
  controllers.users.delete,
);

// Handle any expected errors from this router
router.use(controllers.users.errorHandler);

export default router;

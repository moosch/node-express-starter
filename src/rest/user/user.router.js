/**
 * Our routers are used to define which access routes are available
 * and define how the requests are handled.
 * I find it's a great idea to validate the request as a middleware in Express
 * using src/celebrate/error.middleware
 * 
 * This is also where you could do some security checks,
 * creating a security context, adding request Id's, or preventing progress if required..
 */

import express from 'express';

import middlewareWrapper from '../../component/express/middlewareWrapper';
import controller from './user.controller';
import userSchema from './user.schema';

const router = express.Router();

router.get(
  '/',
  userSchema.findAll,
  middlewareWrapper(controller.findAll),
);

router.get(
  '/:id',
  userSchema.find,
  middlewareWrapper(controller.find),
);

router.post(
  '/',
  userSchema.create,
  middlewareWrapper(controller.create),
);

router.patch(
  '/:id',
  userSchema.update,
  middlewareWrapper(controller.update),
);

router.delete(
  '/:id',
  userSchema.delete,
  middlewareWrapper(controller.delete),
);

// Handle any expected errors from this router
router.use(controller.errorHandler);

export default router;

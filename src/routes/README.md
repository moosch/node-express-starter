# Routes

Routers are used to define which routes are available and how the requests are handled.
 
Routes generally have validation and context middleware before passing the request on to the controller layer.

It also must define a domain-specific error handler.

```typescript
const router = express.Router();

router.get(
  '/:id',
  validation.users.get,
  contextMiddleware,
  controllers.users.get,
);

// more routes

// Handle any expected errors from this router
router.use(controllers.users.errorHandler);

export default router;
```

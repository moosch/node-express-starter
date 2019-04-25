import { isCelebrate } from 'celebrate';

const joiErrorMiddleware = (err, req, res, next) => {
  if (isCelebrate(err)) {
    const { name, _meta, details, _object } = err;

    res.status(400).send({ name, _meta, details });
  } else {
    next(err);
  }
};

export default joiErrorMiddleware;

import errorHandler from './errorHandler';

export default (err, req, res, next) => {
  const handler = errorHandler(err, res);

  return handler('INVALID_REQUEST');
};

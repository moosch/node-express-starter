export default (err, res, errors) => (code, message) => {
  const initialErrors = {
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    INVALID_REQUEST: 400,
    FORBIDDEN: 403,
  };

  const allErrors = { ...initialErrors, ...errors || {} };

  const error = allErrors[code] || allErrors['INTERNAL_SERVER_ERROR'];

  const body = {
    code: error,
    message: message || err.message,
  };

  res.statusMessage = body.error; // e.g INVALID_REQUEST
 
  return res.status(err.statusCode || 500).json(body);
};

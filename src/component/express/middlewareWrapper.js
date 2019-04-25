/**
 * This Express middleware wrapper allows us to not bother adding any try/catch to our controllers.
 * This handles any exceptions for us in one place.
*/

const responseWriter = (res) => (result) => {
  if (result.json !== undefined) {
    return res.status(result.status).json(result.json);
  }

  return res.sendStatus(result.status);
};

const middlewareWrapper = (middleware) => (...args) => middleware(...args)
  .then(responseWriter(args[1]))
  .catch(args[2]);

export default middlewareWrapper;

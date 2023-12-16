import { NotFoundError, UnauthorizedError } from './errorClasses';

const errorMiddleware = ((err, req, res, next) => {
  console.error(err.stack);

  // Check the type of error and render the appropriate EJS page
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error
    res.render(400, '/notfound');
  } else if (err instanceof SyntaxError && err.status === 404 && 'body' in err) {
    // Handle JSON parse error
    res.redirect(404, '/notfound');
  } else if (err instanceof NotFoundError) {
    res.redirect(404, '/notfound');
  } else if (err instanceof UnauthorizedError) {
    res.redirect(401, '/unauthorized');
  } else {
    // Default error handling
    res.redirect(500, '/serverError');
  }
  // Call next without any conditions to ensure execution of subsequent middleware
  next();
});

export default errorMiddleware;

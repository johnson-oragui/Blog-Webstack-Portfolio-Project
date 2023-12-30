/* eslint-disable no-else-return */
import { NotFoundError, UnauthorizedError } from './errorClasses';

const errorMiddleware = ((err, req, res, next) => {
  console.error(err.stack);

  // Call next without any conditions to ensure execution of subsequent middleware
  next();

  // Check the type of error and render the appropriate EJS page
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error
    return res.render('error400');
  } else if (err instanceof SyntaxError && err.status === 404 && 'body' in err) {
    // Handle JSON parse error
    return res.redirect('/notfound');
  } else if (err instanceof NotFoundError || err.status === 404) {
    return res.redirect('/notfound');
  } else if (err instanceof UnauthorizedError || err.status === 401) {
    return res.redirect('/unauthorized');
  } else {
    // Default error handling
    return res.redirect('/serverError');
  }
});

export default errorMiddleware;

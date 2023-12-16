import { NotFoundError, UnauthorizedError } from './errorClasses';

const errorMiddleware = ((err, req, res, next) => {
  console.error(err.stack);

  // Check the type of error and render the appropriate EJS page
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error
    res.render('error400');
  } else if (err instanceof SyntaxError && err.status === 404 && 'body' in err) {
    // Handle JSON parse error
    res.redirect('/notfound');
  } else if (err instanceof NotFoundError || err.status === 404) {
    res.redirect('/notfound');
  } else if (err instanceof UnauthorizedError || err.status === 401) {
    res.redirect('/unauthorized');
  } else {
    // Default error handling
    res.redirect('/serverError');
  }
  // Call next without any conditions to ensure execution of subsequent middleware
  next();
});

export default errorMiddleware;

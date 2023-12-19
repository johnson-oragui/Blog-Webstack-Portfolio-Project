import { NotFoundError, UnauthorizedError } from './errorClasses';

const errorMiddleware = ((err, req, res, next) => {
  console.error(err.stack);

  // Check the type of error and render the appropriate EJS page
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error
    return res.render('error400');
  } else if (err instanceof SyntaxError && err.status === 404 && 'body' in err) {
    // Handle JSON parse error
    const userToken = res.cookie.token;
    return res.render('error404', { userToken });
  } else if (err instanceof NotFoundError || err.status === 404) {
    const userToken = res.cookie.token;
    return res.render('error404', { userToken });
  } else if (err instanceof UnauthorizedError || err.status === 401) {
    const userToken = res.cookie.token;
    return res.render('error401', { userToken });
  } else {
    // Default error handling
    const userToken = res.cookie.token;
    return res.render('error500', { userToken });
  }
  // Call next without any conditions to ensure execution of subsequent middleware
  next();
});

export default errorMiddleware;

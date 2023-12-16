import { NotFoundError, UnauthorizedError } from './errorClasses';

const errorMiddleware = ((err, req, res, next) => {
  console.error(err.stack);

  // Check the type of error and render the appropriate EJS page
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error
    res.status(400).render('error400', { locals: { title: '400 Bad Request', description: 'Invalid JSON' } });
  } else if (err instanceof SyntaxError && err.status === 404 && 'body' in err) {
    // Handle JSON parse error
    res.status(404).render('error404', { locals: { title: '404 Not Found', description: 'Page not found' } });
  } else if (err instanceof NotFoundError) {
    res.status(404).render('error404', { locals: { title: '404 Not Found', description: 'Page not found' } });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).render('error401', { locals: { title: '401 Unauthorized', description: 'Unauthorized access' } });
  } else {
    // Default error handling
    res.status(err.statusCode || 500).render('error500', {
      locals: {
        title: `${err.statusCode || 500} Internal Server Error`,
        description: 'Internal server error',
      },
    });
  }
  // Call next without any conditions to ensure execution of subsequent middleware
  next();
});

export default errorMiddleware;

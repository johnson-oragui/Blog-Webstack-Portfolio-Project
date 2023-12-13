
export const getNotFound = (req, res) => {
  const locals = {
    title: '404 Not Found',
    description: 'The requested page could not be found.',
  };
  res.render('error404', { locals });
};

export const getServerError = (req, res) => {
  const locals = {
    title: '500 Internal Server Error',
    description: 'There was an internal server error',
  };
  res.render('error500', { locals });
};

export const getUnauthorized = (req, res) => {
  const locals = {
    title: '401 Unauthorized',
    description: 'You are not authorized to access this resource.',
  };
  res.render('error401', { locals });
};

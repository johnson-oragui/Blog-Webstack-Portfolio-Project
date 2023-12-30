/**
 * @description Renders the 404 Not Found page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getNotFound = (req, res) => {
  // Locals object containing data for rendering the template
  const locals = {
    title: '404 Not Found',
    description: 'The requested page could not be found.',
  };

  // Fetch user token from response cookie
  const userToken = res.cookie.token;

  // Render the error404 template with locals and userToken
  return res.render('error404', { locals, userToken });
};

/**
 * @description Renders the 500 Internal Server Error page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getServerError = (req, res) => {
  const locals = {
    title: '500 Internal Server Error',
    description: 'There was an internal server error',
  };
  const userToken = res.cookie.token;
  return res.render('error500', { locals, userToken });
};

/**
 * @description Renders the 400 Bad Request page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getBadRequest = (req, res) => {
  const locals = {
    title: '400 Bad Request',
    description: 'Invalid JSON',
  };
  const userToken = res.cookie.token;
  return res.render('error400', { locals, userToken });
};

/**
 * @description Renders the 401 Unauthorized page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getUnauthorized = (req, res) => {
  const locals = {
    title: '401 Unauthorized',
    description: 'You are not authorized to access this resource.',
  };
  const userToken = res.cookie.token;
  return res.render('error401', { locals, userToken });
};

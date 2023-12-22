import Post from '../models/post';
import User from '../models/user';
import { checkHashedPwd } from '../utils/bcryptUtils';
import { generateAcessToken } from '../routes/authMiddleware/generateVerifyAccessToken';
import { generateRefreshToken } from '../routes/authMiddleware/generateFreshToken';

const adminLayout = '../views/layouts/admin';

/**
   * @description Renders the login page
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @param {Function} next - the next middleware function
   */
export const getLoginPage = async (req, res, next) => {
  try {
    res.locals.title = 'Admin';
    res.locals.description = 'Admin DashBoard';
    res.locals.userToken = req.cookies.token;

    console.log('userToken from getLoginPage:', req.cookies.token);
    // if (userToken) {
    //   console.log('already logged in');
    //   return res.redirect('/dashboard');
    // }

    return res.render('admin/login', {
      layout: adminLayout,
      message: 'Please enter your data to login',
      messageClass: 'success',
      username: '',
      password: '',
    });
  } catch (error) {
    console.error('error in getLoginPage method', error.message);
    next(error);
  }
};

/**
 * @description handles the login form submission
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const postLoginPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Admin',
      description: 'Admin DashBoard',
    };
    let userToken = req.cookies.token;

    if (req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || username.trim() === '') {
        console.log('username missing');
        // Pass the entered values as locals to the login page
        return res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message: 'Username is missing',
          messageClass: 'failure',
          userToken,
        });
      }
      if (!password || password.trim() === '') {
        console.log('password missing');
        // Pass the entered values as locals to the login page
        return res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message: 'Password is missing',
          messageClass: 'failure',
          userToken,
        });
      }
      const user = await User.findOne({ username });

      if (!user) {
        console.log('Incorrect Credentials');
        // Pass the entered values as locals to the login page
        return res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message: 'Incorrect Credentials',
          messageClass: 'failure',
          userToken,
        });
      }

      const pwdMatch = await checkHashedPwd(password, user.hashedPassword);
      if (!pwdMatch) {
        console.log('incorrect Credentials');
        // Pass the entered values as locals to the login page
        return res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message: 'Incorrect Credentials',
          messageClass: 'failure',
          userToken,
        });
      }
      // Generate jwt token
      const token = generateAcessToken(user);
      userToken = token;
      console.log('token from loginRoute: ', token);
      console.log('userToken from loginRoute: ', userToken);

      const refreshToken = generateRefreshToken(user);
      console.log('refreshToken from loginRoute: ', refreshToken);

      res.cookie('token', token, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('error in getAdminPage method', error.message);
    console.error('error in getAdminPage method', JSON.stringify(error));
    next(error);
  }
};

/**
 * @description Renders the register page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getRegPage = async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      res.locals.title = 'Reistration Page';
      res.locals.description = 'Register with us';
      res.locals.messageClass = 'success';
      res.locals.message = 'Fill in your details to register';
      res.locals.adminLayout = adminLayout;
      res.locals.userToken = req.cookies.token;
      res.locals.firstname = '';
      res.locals.lastname = '';
      res.locals.username = '';
      res.locals.email = '';
      res.locals.password = '';
      res.locals.password2 = '';
      return res.render('admin/register');
    }
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
};

/**
 * @description Renders the dashboard page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getDashboard = async (req, res, next) => {
  try {
    const locals = {
      title: 'Dashboard Page',
      description: 'My Dashboard',
    };
    const userToken = req.cookies.token;
    console.log('userToken from geDashboard route: ', userToken);

    const data = await Post.find();

    return res.render('admin/dashboard', {
      locals,
      userToken,
      layout: adminLayout,
      data,
    });
  } catch (error) {
    console.error('Error in getDashboard method');
    next(error);
  }
};

/**
 * @description Renders the add post page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getAddPost = async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      res.locals.title = 'Add post Page';
      res.locals.description = 'Add post';
      // Define default values for the variables
      res.locals.titleValue = '';
      res.locals.categoryValue = '';
      res.locals.bodyValue = req.body.body || '';

      console.log('userToken from getAddPost route: ', req.cookies.token);

      return res.render('admin/add-post', {
        userToken: req.cookies.token,
        layout: adminLayout,
        message: 'Fill in all to create a post, category is optional',
        messageClass: 'success',
      });
    }
  } catch (error) {
    console.error('Error in getAddPost method');
    next(error);
  }
};

/**
 * @description Handles the add post form submission
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const postAddPost = async (req, res, next) => {
  try {
    if (req.method === 'POST') {
      const userToken = req.cookies.token;
      console.log('userToken from postAddPost route: ', userToken);

      const { title, category, body } = req.body;

      console.log('title section,  check for title');
      if (!title || title.trim() === '') {
        console.log('title missing');
        console.log('body: ', body);
        res.locals.title = 'Add post Page';
        res.locals.description = 'Add post';

        res.locals.titleValue = title;
        res.locals.categoryValue = category;
        res.locals.bodyValue = body;
        return res.render('admin/add-post', {
          userToken,
          message: 'Title missing',
          messageClass: 'failure',
          bodyValue: req.body.body,
        });
      }
      console.log('title section,  check for title passed');

      console.log('body section,  check for body');
      if (!body || body.trim() === '') {
        console.log('body missing');
        res.locals.title = 'Add post Page';
        res.locals.description = 'Add post';

        res.locals.titleValue = title;
        res.locals.categoryValue = category;
        res.locals.bodyValue = body;
        return res.render('admin/add-post', {
          userToken,
          message: 'Content missing',
          messageClass: 'failure',
          bodyValue: body,
        });
      }
      console.log('body section,  check for body passed');

      const dataToInsert = {
        title,
        category,
        body,
      };

      const newPost = new Post(dataToInsert);

      const data = await Post.create(newPost);
      console.log('successfully inserted: ', data._id);

      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error in postAddPost method');
    next(error);
  }
};

// get edit post controller
export const getEditPost = async (req, res, next) => {

};

// post edit post controller
export const postAditPost = async (req, res, next) => {

};

// get delete post controller
export const getDeletePost = async (req, res, next) => {

};

// post delete post controller
export const postDeletePost = async (req, res, next) => {

};

export const getNotes = async (req, res, next) => {
  try {
    const locals = {
      title: 'Dashboard Page',
      description: 'My Dashboard',
    };
    const userToken = req.cookies.token;
    return res.render('admin/notes', { locals, userToken, layout: adminLayout });
  } catch (error) {
    console.error('Error in getDashboard method');
    next(error);
  }
};

export const logout = (_, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  return res.redirect('/login');
};

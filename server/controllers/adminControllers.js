import jwt from 'jsonwebtoken';
import Post from '../models/post';
import User from '../models/user';
import { checkHashedPwd } from '../utils/bcryptUtils';
import cookieParser from 'cookie-parser';
import { generateAcessToken } from '../routes/authMiddleware/generateVerifyAccessToken';
import authenticationMiddleware from '../routes/authMiddleware/authMiddleware';
import { generateRefreshToken } from '../routes/authMiddleware/generateFreshToken';

const adminLayout = '../views/layouts/admin';

// Admin logging page
export const getLoginPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Admin',
      description: 'Admin DashBoard',
    };
    const message = 'Please enter your data to login';
    const userToken = req.cookies.token;
    console.log('userToken from getLoginPage:', userToken);
    if (userToken) {
      console.log('already logged in');
      return res.redirect('/dashboard');
    }

    return res.render('admin/login', {
      locals,
      layout: adminLayout,
      message,
      messageClass: 'success',
      username: req.params.username || null,
      password: null,
      userToken,
    });
  } catch (error) {
    console.error('error in getAdminPage method', error.message);
    next(error);
  }
};

// Handle login form submission
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
      // return res.render('admin/dashboard', { layout: adminLayout, userToken }); // index.ejs inside admin folder
      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('error in getAdminPage method', error.message);
    console.error('error in getAdminPage method', JSON.stringify(error));
    next(error);
  }
};

// Admin register page
export const getRegPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Reistration Page',
      description: 'Register with us',
    };
    const userToken = req.cookies.token || null;
    if (req.method === 'GET') {
      return res.render('admin/register', {
        locals,
        adminLayout,
        message: 'Fill in your details to register',
        messageClass: 'success',
        firstname: null,
        lastname: null,
        username: null,
        email: null,
        password: null,
        password2: null,
        userToken,
      });
    }
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const locals = {
      title: 'Dashboard Page',
      description: 'My Dashboard',
    };
    const userToken = req.cookies.token;
    console.log('userToken from geDashboard route: ', userToken);

    return res.render('admin/dashboard', { locals, userToken, layout: adminLayout });
  } catch (error) {
    console.error('Error in getDashboard method');
    next(error);
  }
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

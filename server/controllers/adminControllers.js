import Post from '../models/post';
import User from '../models/user';
import { checkHashedPwd } from '../utils/bcryptUtils';

const adminLayout = '../views/layouts/admin';

// Admin logging page
export const getLoginPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Admin',
      description: 'Admin DashBoard',
    };
    const message = 'Please enter your data to login';

    return res.render('admin/login', {
      locals,
      layout: adminLayout,
      message,
      messageClass: 'success',
      username: req.params.username || null,
      password: null,
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
          message: 'Incprrect Credentials',
          messageClass: 'failure',
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
        });
      }
      return res.render('dashboard', { layout: adminLayout }); // index.ejs inside admin folder
    }
  } catch (error) {
    console.error('error in getAdminPage method', error.message);
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
      });
    }
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
};

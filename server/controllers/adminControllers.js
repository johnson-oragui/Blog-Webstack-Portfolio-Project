import bcrypt from 'bcrypt';
import Post from '../models/post';
import User from '../models/user';

async function checkHashedPwd(pwd, hashedPwd) {
  try {
    const match = await bcrypt.compare(pwd, hashedPwd);
    return match;
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
}

const adminLayout = '../views/layouts/admin';

// Admin logging page
export const getLoginPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Admin',
      description: 'Admin DashBoard',
    };
    const message = 'Please enter your data to login';

    res.render('admin/login', {
      locals,
      layout: adminLayout,
      message,
      messageClass: 'success',
      username: null,
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

    let message = '';

    if (req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || username.trim() === '') {
        message = 'Username is missing';
        console.log('username missing');
        // Pass the entered values as locals to the login page
        res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message,
          messageClass: 'failure',
        });
      }
      if (!password || password.trim() === '') {
        message = 'Password is missing';
        console.log('password missing');
        // Pass the entered values as locals to the login page
        res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message,
          messageClass: 'failure',
        });
      }
      const user = User.findOne({ username });

      if (!user) {
        message = 'User not found';
        console.log('User not found');
        // Pass the entered values as locals to the login page
        res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message,
          messageClass: 'failure',
        });
      }
      const pwdMatch = await checkHashedPwd(password, user.password);
      if (!pwdMatch) {
        message = 'Incorrect Password';
        console.log('incorrect password');
        // Pass the entered values as locals to the login page
        res.render('admin/login', {
          locals,
          layout: adminLayout,
          username,
          password,
          message,
          messageClass: 'failure',
        });
      }
      res.redirect('dashboard', { locals, layout: adminLayout }); // index.ejs inside admin folder
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
    res.render('/register', { locals, adminLayout });
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
};

// Admin register page
export const postRegPage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Reistration Page',
      description: 'Register with us',
    };
    res.redirect('/login', { locals, adminLayout });
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
};
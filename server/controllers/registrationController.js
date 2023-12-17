import { hashedPwd } from '../utils/bcryptUtils';
import insertUserData from './userController';
import User from '../models/user';

const adminLayout = '../views/layouts/admin';

// Admin register page
export default async function postRegPage(req, res, next) {
  try {
    const locals = {
      title: 'Reistration Page',
      description: 'Register with us',
    };

    if (req.method === 'POST') {
      const {
        firstname,
        lastname,
        username,
        email,
        password,
        password2,
      } = req.body;

      if (!firstname || firstname.trim() === '') {
        console.error('firstname missing', firstname);
        return res.render('admin/register', {
          locals,
          message: 'First Name is missing',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      if (!lastname || lastname.trim() === '') {
        console.error('lastname missing', lastname);
        return res.render('admin/register', {
          locals,
          message: 'Last Name is missing',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      if (!username || username.trim() === '') {
        console.error('username missing', username);
        return res.render('admin/register', {
          locals,
          message: 'Username is missing',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      if (!email || email.trim() === '') {
        console.error('email missing', email);
        return res.render('admin/register', {
          locals,
          message: 'Email is missing',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      if (!password || password.trim() === '') {
        console.error('password missing', password);
        return res.render('admin/register', {
          locals,
          message: 'Password is missing',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      if (!password2 || password2.trim() === '') {
        console.error('password2 missing', password2);
        return res.render('admin/register', {
          locals,
          message: 'Confirm your Password',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }
      const passwordMatch = password === password2;

      if (!passwordMatch) {
        console.error('password1 and password2 are not a match');
        return res.render('admin/register', {
          locals,
          message: 'Both Passwords do not match',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }
      const hashedPassword = await hashedPwd(password);
      const hashedPassword2 = await hashedPwd(password2);

      const userData = {
        firstname,
        lastname,
        username,
        email,
        hashedPassword,
        hashedPassword2,
      };
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        console.error('user name already exists');
        return res.render('admin/register', {
          locals,
          message: 'Username already exists',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.error('Email already exists');
        return res.render('admin/register', {
          locals,
          message: 'Email already exists',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }
      const user = await insertUserData(userData);

      if (!user) {
        console.log('cound not add user');
        return res.render('admin/register', {
          locals,
          message: 'Could not register the user',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      return res.render('admin/login', {
        locals,
        adminLayout,
        username,
        password,
        message: `${username} Succesfully registered!`,
        messageClass: 'success',
      });
    }
  } catch (error) {
    console.error('Error in getRegPage', error.message);
    next(error);
  }
}

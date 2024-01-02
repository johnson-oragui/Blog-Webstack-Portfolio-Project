import { hashedPwd } from '../utils/bcryptUtils';
import insertUserData from './userController';
import User from '../models/user';

// Path to the admin layout file
const adminLayout = '../views/layouts/admin';

/**
 * Handles the POST request for the registration page.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export default async function postRegPage(req, res, next) {
  try {
    // Set local variables for the view
    res.locals.title = 'Reistration Page';
    res.locals.description = 'Register with us';
    res.locals.userToken = req.cookies.token;
    res.locals.layout = adminLayout;

    // Check if the request method is POST
    if (req.method === 'POST') {
      // Destructure request body
      const {
        firstname,
        lastname,
        username,
        email,
        password,
        password2,
      } = req.body;

      // Validation checks for form fields
      if (!firstname || firstname.trim() === '') {
        console.error('firstname missing');
        return res.render('admin/register', {
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

      // Check if lastname is present
      if (!lastname || lastname.trim() === '') {
        console.error('lastname missing');
        return res.render('admin/register', {
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

      // Check if username is present
      if (!username || username.trim() === '') {
        console.error('username missing');
        return res.render('admin/register', {
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

      // Check if email is present
      if (!email || email.trim() === '') {
        console.error('email missing');
        return res.render('admin/register', {
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

      // Check for password length
      if (password.length < 6) {
        console.error('password must be upto six(6) characters');
        return res.render('admin/register', {
          message: 'Password must be upto six(6) characters',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      // Check if password is present
      if (!password || password.trim() === '') {
        console.error('password missing');
        return res.render('admin/register', {
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

      // Check for password2 length
      if (password2.length < 6) {
        console.error('password2 must be upto six(6) characters');
        return res.render('admin/register', {
          message: 'Password Confirmation must be upto six(6) characters',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      // Check if password is present
      if (!password2 || password2.trim() === '') {
        console.error('password2 missing');
        return res.render('admin/register', {
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
      // Check if both passwords are same
      const passwordMatch = password === password2;

      if (!passwordMatch) {
        console.error('password1 and password Confirmation are not a match');
        return res.render('admin/register', {
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
      // Hash passwords
      const hashedPassword = await hashedPwd(password);
      const hashedPassword2 = await hashedPwd(password2);

      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        console.error('user name already exists');
        return res.render('admin/register', {
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

      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.error('Email already exists');
        return res.render('admin/register', {
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

      // Prepare user data for insertion
      const userData = {
        firstname,
        lastname,
        username,
        email,
        hashedPassword,
        hashedPassword2,
      };

      // Insert user data into the database
      const user = await insertUserData(userData);

      // Check if user was successfully added
      if (!user) {
        console.error('cound not add user');
        return res.render('admin/register', {
          message: 'Could not register the user, Please try again.',
          messageClass: 'failure',
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      }

      // Redirect to login page on successful registration
      return res.render('admin/login', {
        layout: adminLayout,
        adminLayout,
        username,
        password,
        message: `${username} Succesfully registered!`,
        messageClass: 'success',
      });
    }
  } catch (error) {
    // console.error('Error in getRegPage', error.message);
    // Pass the error to the next middleware
    next(error);
  }
}

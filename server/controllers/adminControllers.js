import Post from '../models/post';
import User from '../models/user';
import ArchivedPost from '../models/archived-post';
import { checkHashedPwd } from '../utils/bcryptUtils';
import { generateAcessToken, verifyAccessToken } from '../routes/tokenHelpers/generateVerifyAccessToken';
import { generateRefreshToken } from '../routes/tokenHelpers/generateFreshToken';

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
 * Controller function to handle user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const postLoginPage = async (req, res, next) => {
  try {
    // Set default values for locals
    const locals = {
      title: 'Admin',
      description: 'Admin DashBoard',
    };
    // Get user token from cookies
    const userToken = req.cookies.token;

    // Check if the request method is POST
    if (req.method === 'POST') {
      // Extract username and password from request body
      const { username, password } = req.body;

      // Validate username
      if (!username || username.trim() === '') {
        console.log('Username missing');
        // Render login view with an error message
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

      // Validate password
      if (!password || password.trim() === '') {
        console.log('Password missing');
        // Render login view with an error message
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

      // Find the user with the provided username
      const user = await User.findOne({ username });

      // Check if the user exists
      if (!user) {
        console.log('Incorrect Credentials');
        // Render login view with an error message
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

      // Check if the provided password matches the hashed password
      const pwdMatch = await checkHashedPwd(password, user.hashedPassword);

      // Check if the password is incorrect
      if (!pwdMatch) {
        console.error('Incorrect Credentials');
        // Render login view with an error message
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

      // Generate JWT token and refresh token
      const token = generateAcessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set JWT token and refresh token as cookies
      res.cookie('token', token);
      res.cookie('refreshToken', refreshToken);

      // Redirect to the dashboard
      return res.redirect('/dashboard');
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in postLoginPage method', error.message);
    // console.error('Error details:', JSON.stringify(error));
    next(error);
  }
};

/**
 * Controller function to render the registration page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getRegPage = async (req, res, next) => {
  try {
    // Check if the request method is GET
    if (req.method === 'GET') {
      // Set locals variables for rendering the view
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

      // Render the registration view
      return res.render('admin/register');
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getRegPage', error.message);
    next(error);
  }
};

/**
 * Controller function to render the admin dashboard page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getDashboard = async (req, res, next) => {
  try {
    // Extract user token from cookies
    const userToken = req.cookies.token;

    // Verify the user token and extract data
    const { data } = await verifyAccessToken(userToken);

    // Set locals variables for rendering the view
    res.locals.data = data;
    res.locals.title = 'Dashboard';
    res.locals.description = 'Admin DashBoard';
    res.locals.message = 'Welcome';
    res.locals.messageClass = 'success';

    // Number of blog posts to display per page
    const perPage = 5;

    // Get the current page from the query parameters or default to 1
    const page = req.query.page || 1;

    // Fetch blog posts using aggregation, skip, and limit
    const posts = await Post.aggregate([{ $sort: { createdAt: 1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count total number of blog posts
    const count = await Post.countDocuments();

    // Calculate pagination parameters
    const nextPage = parseInt(page, 10) + 1;
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = nextPage <= totalPages;
    const prevPage = page > 1 ? page - 1 : null;

    // Render the admin dashbpoard template with locals and pagination data
    return res.render('admin/dashboard', {
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      totalPages,
      prevPage,
      userToken,
      posts,
      layout: adminLayout,
    });
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getDashboard method', error.message);
    next(error);
  }
};

/**
 * Controller function to render the add post page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getAddPost = async (req, res, next) => {
  try {
    // Check if the request method is GET
    if (req.method === 'GET') {
      // Set locals variables for rendering the view
      res.locals.title = 'Add post Page';
      res.locals.description = 'Add post';

      // Define default values for the variables
      res.locals.titleValue = '';
      res.locals.categoryValue = '';
      res.locals.bodyValue = '';

      // Render the add post view with default values and a success message
      return res.render('admin/add-post', {
        userToken: req.cookies.token,
        layout: adminLayout,
        message: 'Fill in all to create a post, category is optional',
        messageClass: 'success',
      });
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getAddPost method: ', error.message);
    next(error);
  }
};

/**
 * Controller function to handle adding a new post.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const postAddPost = async (req, res, next) => {
  try {
    // Check if the request method is POST
    if (req.method === 'POST') {
      // Set locals variables for rendering the view
      res.locals.userToken = req.cookies.token;
      res.locals.title = 'Add post Page';
      res.locals.description = 'Add post';

      // Extract data from request body
      const { title, category, body } = req.body;

      // Check if title is missing or empty
      if (!title || title.trim() === '') {
        console.error('title missing');

        // Render the add post view with an error message
        res.locals.titleValue = title;
        res.locals.categoryValue = category;
        return res.render('admin/add-post', {
          message: 'Title missing',
          messageClass: 'failure',
          bodyValue: body,
        });
      }

      // Check if body is missing or empty
      if (!body || body.trim() === '') {
        console.error('body missing');

        // Render the add post view with an error message
        res.locals.titleValue = title;
        res.locals.categoryValue = category;
        return res.render('admin/add-post', {
          message: 'Content missing',
          messageClass: 'failure',
          bodyValue: body,
        });
      }

      // Create an object with data to insert into the database
      const dataToInsert = {
        title,
        category,
        body,
      };

      // Create a new post instance
      const newPost = new Post(dataToInsert);

      // Insert the new post into the database
      await Post.create(newPost);

      // Redirect to the dashboard after successful insertion
      return res.redirect('/dashboard');
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in postAddPost method: ', error.message);
    next(error);
  }
};

/**
 * Controller function to render the edit post page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getEditPost = async (req, res, next) => {
  try {
    // Check if the request method is GET
    if (req.method === 'GET') {
      // Set locals variables for rendering the view
      res.locals.title = 'Edit Post';
      res.locals.description = 'Edit Post ';
      res.locals.layout = adminLayout;
      res.locals.userToken = req.cookies.token;
      res.locals.messageClass = 'success';
      res.locals.message = 'Edit Your Post to Update';

      // Extract post id from request parameters
      const postId = req.params.id;

      try {
        // Find the post in the database by id
        const post = await Post.findById(postId);
        if (!post) {
          console.error('Could not find post');
          return res.redirect('/dashboard');
        }

        // Set locals variables with post details for rendering the view
        res.locals.titleValue = post.title;
        res.locals.categoryValue = post.category;
        res.locals.bodyValue = post.body;
        res.locals.post = post;

        // Render the edit post view
        return res.render('admin/edit-post');
      } catch (error) {
        // Handle errors by logging and redirecting to the dashboard
        console.error('error fetching posts: ', error.message);
        res.locals.messageClass = 'failure';
        res.locals.message = 'Error fetching posts';
        return res.redirect('/dashboard');
      }
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getEditPost method', error.message);
    next(error);
  }
};

/**
 * Controller function to handle the editing of a post.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const postEditPost = async (req, res, next) => {
  try {
    // Check if the request method is PUT
    if (req.method === 'PUT') {
      // Set locals variables for rendering the view
      res.locals.title = 'Edit Post';
      res.locals.description = 'Edit Post ';
      res.locals.layout = adminLayout;
      res.locals.userToken = req.cookies.token;

      // Extract post id from request parameters
      const postId = req.params.id;

      // Extract updated post details from request body
      const { title, category, body } = req.body;

      try {
        // Update the post in the database
        await Post.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            body,
            updatedAt: Date.now(),
          },
          { new: true },
        );

        // Set locals variables for rendering the view
        res.locals.messageClass = 'success';
        res.locals.message = 'Updated successfully';
        res.locals.data = '';
        res.locals.posts = await Post.find();
        res.locals.nextPage = req.params;
        res.locals.current = req.params;

        // Render the admin dashboard view
        return res.render('admin/dashboard');
      } catch (error) {
        // Handle errors by logging and redirecting to the edit post page
        // console.error('error updating post', error.message);
        return res.redirect(`/edit-post/${postId}`);
      }
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('error in postEditPost method', error.message);
    next(error);
  }
};

/**
 * Controller function to handle the deletion confirmation of a post.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getDeletePostConfirmation = async (req, res, next) => {
  const postId = req.params.id;

  try {
    res.locals.userToken = req.cookies.token;
    const singlePost = await Post.findById(postId);
    if (!singlePost) {
      console.error('Could not find post');
      return res.redirect('/dashboard');
    }

    res.render('admin/confirmation', { singlePost, layout: adminLayout });
  } catch (error) {
    // console.error('error in getDeletePostConfirmation method: ', error.message);
    next(error);
  }
};

/**
 * Controller function to handle the deletion of a post.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const postDeletePost = async (req, res, next) => {
  // Extract post id from request parameters
  const postId = req.params.id;

  try {
    // Check if the request method is DELETE
    if (req.method === 'DELETE') {
      // Find the post by id in the database
      const singlePost = await Post.findById(postId);

      // Create an archived post with the details of the deleted post
      await ArchivedPost.create({
        title: singlePost.title,
        category: singlePost.category,
        body: singlePost.body,
        createdAt: singlePost.createdAt,
        deletedAt: singlePost.updatedAt,
      });

      // Store the title of the deleted post
      const postTitle = singlePost.title;

      // Delete the post from the main posts collection
      await Post.deleteOne({ _id: postId });

      // Set locals variables for rendering the view
      res.locals.messageClass = 'success';
      res.locals.message = `${postTitle} deleted successfully`;
      res.locals.data = '';
      res.locals.posts = await Post.find();
      res.locals.layout = adminLayout;
      res.locals.userToken = req.cookies.token;
      res.locals.nextPage = req.params;
      res.locals.current = req.params;

      // Render the admin dashboard view
      return res.render('admin/dashboard');
    }
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('error in postDeletePost page: ', error.message);
    next(error);
  }
};

/**
 * Controller function to get all archived posts.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getArchive = async (req, res, next) => {
  try {
    // Set locals variables for rendering the view
    res.locals.title = 'Archive Page';
    res.locals.description = 'My Deleted Posts';
    res.locals.message = 'Archived/Deleted Posts';
    res.locals.messageClass = 'success';

    // Fetch all archived posts from the database
    const archivedPosts = await ArchivedPost.find();

    // Set user token from the request cookies to locals
    res.locals.userToken = req.cookies.token;

    // Render the view with the archived posts
    return res.render('admin/archive', { archivedPosts, layout: adminLayout });
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getArchive method', error.message);
    next(error);
  }
};

/**
 * Controller function to get details of an archived post.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getArchivedPosts = async (req, res, next) => {
  try {
    // Set locals variables for rendering the view
    res.locals.title = 'Archived Post';
    res.locals.description = 'My Deleted Post';
    res.locals.message = 'Archived/Deleted Post';
    res.locals.messageClass = 'success';
    res.locals.userToken = req.cookies.token;

    // Extract the archived post id from the request parameters
    const archivedPostId = req.params.id;

    // Find the archived post by id in the database
    const archivedPost = await ArchivedPost.findById(archivedPostId);

    // If the archived post is not found, redirect to the archive page
    if (!archivedPost) {
      console.error('Archived post not found');
      return res.redirect('/archive');
    }

    // Set locals variables with values from the archived post
    res.locals.titleValue = archivedPost.title;
    res.locals.categoryValue = archivedPost.category;
    res.locals.bodyValue = archivedPost.body;

    // Render the view with archived post details
    return res.render('admin/archived-posts', { archivedPost, layout: adminLayout });
  } catch (error) {
    // Handle errors by logging and passing them to the next middleware
    // console.error('Error in getArchivedPosts method', error.message);
    next(error);
  }
};

/**
 * @description handles the logout request
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const logout = (req, res) => {
  // clear the cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  // redirect to the login page
  return res.redirect('/login');
};

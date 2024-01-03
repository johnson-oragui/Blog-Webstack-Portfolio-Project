/* eslint-disable import/no-extraneous-dependencies */
import Post from '../models/post';
import redisClient from '../dbUtils/redisClient';

/**
 * @description Renders the Home Page with blog posts
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getHomePage = async (req, res, next) => {
  try {
    // measure response time
    const start = Date.now();

    // Locals object containing data for rendering the template
    res.locals.title = 'Home Page';
    res.locals.description = 'Blog Post with MongoDB and Node.js';
    res.locals.userToken = req.cookies.token;

    // Number of blog posts to display per page
    const perPage = 5;

    // Get the current page from the query parameters or default to 1
    const page = req.query.page || 1;

    // Fetch blog posts using aggregation, skip, and limit
    const data = await Post.aggregate([{ $sort: { createdAt: 1 } }])
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

    // use the same key as in redisRouteHandler.js
    const key = `__blog__.${req.originalUrl}`;
    try {
      // Check if data is in cache
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        // Parse cached data and set it to a local variable
        const parsedData = JSON.parse(cachedData);

        // Render the index template with locals and pagination data
        return res.render('index', {
          data: parsedData,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
          totalPages,
          prevPage,
        });
      }
    } catch (error) {
      console.error('error in getHomePage - Redis cache', error.message);
      throw error;
    }

    // cache the response data
    redisClient.setex(key, 60000, JSON.stringify(data));

    // measure response time
    const end = Date.now();

    console.log('response time: ', end - start, 'ms');

    // Render the index template with locals and pagination data
    return res.render('index', {
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      totalPages,
      prevPage,
    });
  } catch (error) {
    console.error('Error in getHomePage method', error);
    // Handle errors by passing them to the next middleware
    next(error);
  }
};

/**
 * @description Renders a single blog post by its ID
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getPost = async (req, res, next) => {
  try {
    // Extract the post ID from request parameters
    const { id } = req.params;

    // Set the user token in locals from request cookies
    res.locals.userToken = req.cookies.token;
    res.locals.authorValue = '';
    res.locals.commentValue = '';
    res.locals.message = '';
    res.locals.messageClasses = '';

    // Check if the post ID is missing
    if (!id) {
      console.error('Id not found');
      // Render the 401 error page if the ID is missing
      return res.render('error401');
    }

    // Fetch the blog post by its ID
    const data = await Post.findById({ _id: id });

    // Check if the blog post is not found
    if (!data) {
      console.error('Data not found');
      // Render the 401 error page if the data is not found
      return res.render('error401');
    }

    // Render the post template with the retrieved data
    return res.render('post', { data, comments: data.comments });
  } catch (error) {
    // console.error('Error in getPost method', error);
    // Handle errors by passing them to the next middleware
    next(error);
  }
};

export const getAddComment = async (req, res, next) => {
  try {
    // retrieve the post id from the client request
    const { id, commentId } = req.params;
    res.locals.userToken = req.cookies.token;
    res.locals.commentValue = '';
    res.locals.authorValue = '';

    // find the post by Id
    const post = await Post.findById(id);

    // check if the post is not found
    if (!post) {
      console.error('post not found: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }

    const comment = post.comments.id(commentId);
    // check if the post is not found
    if (!comment) {
      console.error('post not found: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }

    return res.render('comment', { comment, post });
  } catch (error) {
    // console.error('error in getAddComment: ', error.message);
    next(error);
  }
};

export const postAddComment = async (req, res, next) => {
  try {
    // retrieve the post id from the client request
    const { id } = req.params;
    // retrieve the author and content for comments
    const { author, content } = req.body;

    // check for a comment, id, and author
    if (!id || !author || !content) {
      console.error('required fields missing: ');
      return res.redirect(`/post/${id}`);
    }

    // find the post by Id
    const post = await Post.findById(id);

    // check if the post is not found
    if (!post) {
      console.error('post not found: ');
      return res.redirect(`/post/${id}`);
    }

    // add the new comment to the post
    post.comments.push({
      author,
      content,
      createAt: Date.now(),
    });

    // save the post
    await post.save();

    return res.redirect(`/post/${id}`);
  } catch (error) {
    // console.error('error in postAddComment page: ', error.message);
    next(error);
  }
};

export const postAddReplyComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    const { author, content } = req.body;

    if (!author) {
      console.error('required fields missing: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }
    if (!content) {
      console.error('required fields missing: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }

    const post = await Post.findById(id);
    // check if the post is not found
    if (!post) {
      console.error('post not found: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }

    const comment = post.comments.id(commentId);
    // check if the post is not found
    if (!comment) {
      console.error('post not found: ');
      return res.redirect(`/post/${id}/comment/${commentId}`);
    }

    comment.replies.push({
      author,
      content,
      createdAt: Date.now(),
    });

    await post.save();

    return res.redirect(`/post/${id}/comment/${commentId}`);
  } catch (error) {
    // console.error('error in postAddReplyComment: ', error);
    next(error);
  }
};

/**
 * @description Renders the About Us page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getAboutPage = (req, res) => {
  // Define locals for rendering the template
  const locals = {
    title: 'About Page',
    description: 'About Us',
  };

  // Set the user token in locals from request cookies
  res.locals.userToken = req.cookies.token;

  // Render the 'about' template with the provided locals
  return res.render('about', { locals });
};

/**
 * @description Renders the Contact Us page
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const getContactPage = (req, res) => {
  // Define locals for rendering the template
  const locals = {
    title: 'Contact Us',
    description: 'Get in touch with us',
  };

  // Set the user token in locals from request cookies
  res.locals.userToken = req.cookies.token;

  // Render the 'contact' template with the provided locals
  return res.render('contact', { locals });
};

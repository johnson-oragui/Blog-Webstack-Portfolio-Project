import Post from '../models/post';

/**
 * @description Renders the Home Page with blog posts
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
export const getHomePage = async (req, res, next) => {
  try {
    // Locals object containing data for rendering the template
    const locals = {
      title: 'Home Page',
      description: 'Blog Post with MongoDB and Node.js',
    };

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

    // Render the index template with locals and pagination data
    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      totalPages,
      prevPage,
      userToken: req.cookies.token,
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
      console.error('Id not found', id);
      // Render the 401 error page if the ID is missing
      return res.render('error401');
    }

    // Fetch the blog post by its ID
    const data = await Post.findById({ _id: id });

    // Check if the blog post is not found
    if (!data) {
      console.error('Data not found', data);
      // Render the 401 error page if the data is not found
      return res.render('error401');
    }
    console.log('comments: ', data.comments);

    // Render the post template with the retrieved data
    return res.render('post', { data, comments: data.comments });
  } catch (error) {
    console.error('Error in getPost method', error);
    // Handle errors by passing them to the next middleware
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
      console.error('required fields missing: ', id, author);
      res.redirect(`/post/${id}`);
    }

    // find the post by Id
    const post = await Post.findById(id);

    // check if the post is not found
    if (!post) {
      console.error('post not found: ', id);
      res.redirect(`/post/${id}`);
    }

    // add the new comment to the post
    post.comments.push({
      author,
      content,
      createAt: Date.now(),
    });

    // save the post
    await post.save();

    res.redirect(`/post/${id}`);
  } catch (error) {
    console.error('error in postAddComment page: ', error.message);
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

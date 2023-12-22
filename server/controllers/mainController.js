import Post from '../models/post';

export const getHomePage = async (req, res, next) => {
  try {
    const locals = {
      title: 'Home Page',
      description: 'Blog Post with MongoDB and Node.js',
    };

    const perPage = 5;
    const page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: 1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page, 10) + 1;
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = nextPage <= totalPages;
    const prevPage = page > 1 ? page - 1 : null;

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
    // res.render('error500');
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    res.locals.userToken = req.cookies.token;

    if (!id) {
      console.error('Id not found', id);
      return res.render('error401');
    }
    const data = await Post.findById({ _id: id });

    if (!data) {
      console.error('data not found', data);
      return res.render('error401');
    }

    return res.render('post', { data });
  } catch (error) {
    console.error('Error in getPost method', error);
    next(error);
  }
};

export const getAboutPage = (req, res) => {
  const locals = {
    title: 'About Page',
    description: 'About Us',
  };
  res.locals.userToken = req.cookies.token;
  return res.render('about', { locals });
};

export const getContactPage = (req, res) => {
  const locals = {
    title: 'Contact Us',
    description: 'Get in touch with us',
  };
  res.locals.userToken = req.cookies.token;

  return res.render('contact', { locals });
};

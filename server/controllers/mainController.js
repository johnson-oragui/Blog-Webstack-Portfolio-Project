import Post from '../models/post';
import mongoose from 'mongoose';

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

    if (!id) {
      console.error('Id not found', id);
      res.render('error401');
      return;
    }
    const data = await Post.findById({ _id: id });

    if (!data) {
      console.error('data not found', data);
      res.render('error401');
      return;
    }

    res.render('post', { data });
  } catch (error) {
    console.error('Error in getPost method', error);
    // res.render('error500');
    next(error);
  }
};

export const getAboutPage = (req, res) => {
  const locals = {
    ttitle: 'About Page',
    description: 'About Us',
  };
  res.render('about', locals);
};

export const getContactPage = (req, res) => {
  const locals = {
    title: 'Contact Us',
    description: 'Get in touch with us',
  };

  res.render('contact', locals);
};

// function insertPostData() {
//   const dummyPosts = [
//     {
//       title: 'Getting started as a software engineer',
//       category: 'Tech',
//       body: 'I started out focused on changing my career from an Electrical Technician to a software engineer as  i have always had more passion for software engineering',
//     },
//     {
//       title: 'The impact of artificial intelligence on society',
//       category: 'AI',
//       body: 'Artificial Intelligence is rapidly changing the landscape of various industries, and its impact on society is profound.',
//     },
//     {
//       title: 'Exploring the wonders of space exploration',
//       category: 'Science',
//       body: 'Space exploration continues to captivate our imaginations as we uncover the mysteries of the cosmos.',
//     },
//     {
//       title: 'Cooking hacks for busy professionals',
//       category: 'Food',
//       body: 'Discover quick and easy cooking hacks to prepare delicious meals, even with a hectic schedule.',
//     },
//     {
//       title: 'The art of creative writing',
//       category: 'Writing',
//       body: 'Expressing oneself through creative writing is a powerful form of communication and self-expression.',
//     },
//     {
//       title: 'The future of renewable energy',
//       category: 'Environment',
//       body: 'As the world shifts towards sustainable practices, the future of renewable energy looks promising.',
//     },
//     {
//       title: 'Exploring diverse cultures through travel',
//       category: 'Travel',
//       body: 'Traveling allows us to experience and appreciate the rich diversity of cultures around the world.',
//     },
//     {
//       title: 'Mindfulness and meditation for a balanced life',
//       category: 'Wellness',
//       body: 'Incorporating mindfulness and meditation into daily routines promotes mental well-being and balance.',
//     },
//     {
//       title: 'Mastering the art of photography',
//       category: 'Photography',
//       body: 'Photography is more than just capturing moments; it is about telling stories through visuals.',
//     },
//     {
//       title: 'The journey of entrepreneurship',
//       category: 'Business',
//       body: 'Embarking on the entrepreneurial journey requires determination, innovation, and resilience.',
//     },
//     {
//       title: 'Healthy habits for a productive lifestyle',
//       category: 'Health',
//       body: 'Establishing healthy habits contributes to a productive and fulfilling lifestyle.',
//     },
//     {
//       title: 'Unraveling the mysteries of the deep sea',
//       category: 'Oceanography',
//       body: 'The deep sea holds many mysteries waiting to be unraveled by scientists and researchers.',
//     },
//     {
//       title: 'DIY home improvement projects',
//       category: 'Home',
//       body: 'Transform your living space with creative and practical DIY home improvement projects.',
//     },
//     {
//       title: 'The evolution of technology in education',
//       category: 'Education',
//       body: 'Technology continues to reshape the education landscape, providing new opportunities for learning.',
//     },
//     {
//       title: 'The influence of art on emotions',
//       category: 'Art',
//       body: 'Art has the power to evoke emotions and connect people on a profound level.',
//     },
//     {
//       title: 'Discovering hidden gems in literature',
//       category: 'Books',
//       body: 'Explore literature to uncover hidden gems that offer unique perspectives and storytelling.',
//     },
//     {
//       title: 'Navigating the challenges of remote work',
//       category: 'Work',
//       body: 'Remote work comes with its challenges, but with effective strategies, it can be a rewarding experience.',
//     },
//     {
//       title: 'The role of mindfulness in stress management',
//       category: 'Wellness',
//       body: 'Mindfulness practices provide valuable tools for managing stress and enhancing overall well-being.',
//     },
//     {
//       title: 'The wonders of the night sky',
//       category: 'Astronomy',
//       body: 'Stargazing allows us to marvel at the wonders of the night sky and the vastness of the universe.',
//     },
//   ];

//   Post.insertMany(dummyPosts);
// }
// insertPostData();

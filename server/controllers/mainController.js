export const getHomePage = (req, res) => {
  const locals = {
    title: 'Home Page',
    description: 'Blog Post with MongoDB and Node.js',
  };

  res.render('index', locals);
};

export const getAboutPage = (req, res) => {
  const locals = {
    ttitle: 'About Page',
    description: 'About Us',
  };
  res.render('about', locals);
};

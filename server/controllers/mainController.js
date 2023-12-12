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

export const getContactPage = (req, res) => {
  const locals = {
    title: 'Contact Us',
    description: 'Get in touch with us',
  };

  res.render('contact', locals);
};

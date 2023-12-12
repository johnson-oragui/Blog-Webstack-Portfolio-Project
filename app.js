require('dotenv').config();
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import mainRouter from './server/routes/main';

// instance of express
const app = express();

// middle ware
app.use(expressEjsLayouts);
app.use(express.static('static'));

// Templates ENgine

// specifies the path to the default layout file to be used when rendering views
// It defines the overall structure of html pages
app.set('layout', './layouts/main');
// specify the template engine to be used
app.set('view engine', 'ejs');

// port
const PORT = process.env.PORT || 5000;

// get methods for Home and about pages
app.use('/', mainRouter);

// event listener
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

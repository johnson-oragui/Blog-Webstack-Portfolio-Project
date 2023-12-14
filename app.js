require('dotenv').config();
import morgan from 'morgan';
import fs from 'fs';
import path, { dirname } from 'path';
import rfs from 'rotating-file-stream';
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import mainRouter from './server/routes/main';
import errorRouter from './server/routes/error';
import dbConnect from './utils/db';

// instance of express
const app = express();

// create a write stream in append mode logs to a file
const logDirectory = path.join(__dirname, 'logs');
const dir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: dir,
});

// Log Http requests to the console
app.use(morgan('combined', { stream: accessLogStream }));

// middleware for parsing JSON in request bodies
app.use(express.json());

// middle ware
app.use(express.static('static'));
app.use(expressEjsLayouts);

// Connect to MongoDB
dbConnect();

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
// get methods for error pages
app.use('/error', errorRouter);

// middlewar foe error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Check the type of error and render the appropriate EJS page
  if (err instanceof NotFoundError) {
    res.status(404).render('error404', { locals: { title: '404 Not Found', description: 'Page not found' } });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).render('error401', { locals: { title: '401 Unauthorized', description: 'Unauthorized access' } });
  } else {
    // Default error handling
    res.status(500).render('error500', { locals: { title: '500 Internal Server Error', description: 'Internal server error' } });
  }
});

// event listener
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

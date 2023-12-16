import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import mainRouter from './server/routes/main';
import errorRouter from './server/routes/error';
import adminRouter from './server/routes/admin';
import dbConnect from './utils/db';
// import error classes from custom file
import { NotFoundError, UnauthorizedError } from './errorClasses';

const rotatingFileStream = require('rotating-file-stream');

require('dotenv').config();

// instance of express
const app = express();

// create a write stream in append mode logs to a file
const logDirectory = path.join(__dirname, 'logs');
const dir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rotatingFileStream.createStream('access.log', {
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  path: logDirectory, // path to the log directory
});

// Log Http requests to the console
app.use(morgan('combined', { stream: accessLogStream }));

// middleware for parsing JSON in request bodies
app.use(express.json());
// middleware for decoding URL-encoded form data.
app.use(express.urlencoded({ extended: false }));

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
app.use('/', errorRouter);
// get methods for admin pages
app.use('/', adminRouter);

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
  } next();
});

// event listener
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

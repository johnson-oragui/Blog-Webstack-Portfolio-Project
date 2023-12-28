import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import mainRouter from './server/routes/main';
import errorRouter from './server/routes/error';
import adminRouter from './server/routes/admin';
import dbConnect from './utils/db';
// import error middlewar
import errorMiddleware from './server/errorMiddleware';

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
// middleware for CookieParser
// Parses cookies attached to the client's request and makes them available
///   in the req.cookies object.
app.use(cookieParser());
// middleware for session support for Express application.
app.use(session({
  secret: process.env.SECRET, // used to sign the session ID cookie.
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI, // uses MongoStore to store session data in MongoDB.
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
    httpOnly: true, // Ensures that the cookie is only accessible by the web server.
    sameSite: 'strict', // Protects against cross-site request forgery attacks
  },
}));
// The session middleware adds a req.session object to each request, allowing the storage
//  and retrieval of data specific to a user's session.
app.use(methodOverride('_method'));
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

// middlewar for error handling
app.use(errorMiddleware);

// event listener
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

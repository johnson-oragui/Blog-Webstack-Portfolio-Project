import express from 'express';
import {
  getHomePage,
  getAboutPage,
  getContactPage,
  getPost,
} from '../controllers/mainController';

const router = express.Router();

// Route to handle requests for the home page
router.get('/', getHomePage);

// Route to handle requests for the about page
router.get('/about', getAboutPage);

// Route to handle requests for the contact page
router.get('/contact', getContactPage);

// Route to handle requests for individual posts
router.get('/post/:id', getPost);

export default router;

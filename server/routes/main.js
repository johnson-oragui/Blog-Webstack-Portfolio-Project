import express from 'express';
import {
  getHomePage,
  getAboutPage,
  getContactPage,
  getPost,
} from '../controllers/mainController';

import {
  getNotFound,
  getServerError,
  getUnauthorized,
} from '../controllers/errorControllers';

const router = express.Router();

router.get('/', getHomePage);

router.get('/about', getAboutPage);

router.get('/contact', getContactPage);

router.get('/post/:id', getPost);
// Error routes
router.get('/notfound', getNotFound);

router.get('/serverError', getServerError);

router.get('/unauthorized', getUnauthorized);

export default router;

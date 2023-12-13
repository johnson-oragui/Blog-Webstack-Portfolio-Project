import express from 'express';
import { getHomePage, getAboutPage, getContactPage, getPost } from '../controllers/mainController';

const router = express.Router();

router.get('/', getHomePage);

router.get('/about', getAboutPage);

router.get('/contact', getContactPage);

router.get('/post/:id', getPost);

export default router;

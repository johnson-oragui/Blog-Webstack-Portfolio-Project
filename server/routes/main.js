import express from 'express';
import { getHomePage, getAboutPage, getContactPage } from '../controllers/mainController';

const router = express.Router();

router.get('/', getHomePage);

router.get('/about', getAboutPage);

router.get('/contact', getContactPage);
export default router;

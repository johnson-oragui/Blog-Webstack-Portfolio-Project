import express from 'express';
import { getHomePage, getAboutPage } from '../controllers/mainController';

const router = express.Router();

router.get('', getHomePage);

router.get('/about', getAboutPage);
export default router;

import express from 'express';
import {
  getLoginPage,
  getRegPage,
  postLoginPage,
} from '../controllers/adminControllers';
import postRegPage from '../controllers/registrationController';

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/register', getRegPage);

router.post('/register', postRegPage);
router.post('/login', postLoginPage);

export default router;

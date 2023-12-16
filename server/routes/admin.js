import express from 'express';
import {
  getLoginPage,
  getRegPage,
  postLoginPage,
  postRegPage,
} from '../controllers/adminControllers';

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/register', getRegPage);

router.post('/register', postRegPage);
router.post('/login', postLoginPage);

export default router;

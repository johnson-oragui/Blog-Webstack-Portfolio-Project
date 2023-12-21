import express from 'express';
import {
  getLoginPage,
  getRegPage,
  postLoginPage,
  getDashboard,
  getNotes,
  logout,
  getAddPost,
  postAddPost,
} from '../controllers/adminControllers';
import postRegPage from '../controllers/registrationController';
import authenticationMiddleware from './authMiddleware/authMiddleware';
import refreshTokenRouter from './refreshTokenRouter';

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/register', getRegPage);
router.get('/logout', logout);

router.get('/dashboard', authenticationMiddleware, getDashboard);
router.get('/notes', authenticationMiddleware, getNotes);
router.get('/add-post', authenticationMiddleware, getAddPost);

router.post('/add-post', postAddPost);
router.post('/register', postRegPage);
router.post('/login', postLoginPage);

router.use(refreshTokenRouter);

export default router;

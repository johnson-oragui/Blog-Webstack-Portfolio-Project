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
  getEditPost,
  postEditPost,
  getDeletePost,
  postDeletePost,
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
router.get('/edit-post/:id', authenticationMiddleware, getEditPost);
router.get('/delete-post/:id', authenticationMiddleware, getDeletePost);

router.post('/add-post', authenticationMiddleware, postAddPost);
router.post('/edit-post/:id', authenticationMiddleware, postEditPost);
router.post('/delete-post/:id', authenticationMiddleware, postDeletePost);
router.post('/register', postRegPage);
router.post('/login', postLoginPage);

router.use(refreshTokenRouter);

export default router;

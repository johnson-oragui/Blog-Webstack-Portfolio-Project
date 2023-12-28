import express from 'express';
import {
  getLoginPage,
  getRegPage,
  postLoginPage,
  getDashboard,
  getArchive,
  logout,
  getAddPost,
  postAddPost,
  getEditPost,
  postEditPost,
  postDeletePost,
  getArchivedPosts,
} from '../controllers/adminControllers';
import postRegPage from '../controllers/registrationController';
import authenticationMiddleware from './authMiddleware/authMiddleware';
import refreshTokenRouter from './refreshTokenRouter';

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/register', getRegPage);
router.get('/logout', authenticationMiddleware, logout);

router.get('/dashboard', authenticationMiddleware, getDashboard);
router.get('/archive', authenticationMiddleware, getArchive);
router.get('/add-post', authenticationMiddleware, getAddPost);
router.get('/edit-post/:id', authenticationMiddleware, getEditPost);
router.get('/archived-posts/:id', authenticationMiddleware, getArchivedPosts);

router.delete('/delete-post/:id', authenticationMiddleware, postDeletePost);

router.put('/edit-post/:id', authenticationMiddleware, postEditPost);

router.post('/add-post', authenticationMiddleware, postAddPost);
router.post('/register', postRegPage);
router.post('/login', postLoginPage);

router.use(refreshTokenRouter);

export default router;

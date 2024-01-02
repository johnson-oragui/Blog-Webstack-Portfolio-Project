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
  getDeletePostConfirmation,
  postDeletePost,
  getArchivedPosts,
} from '../controllers/adminControllers';
import postRegPage from '../controllers/registrationController';
import authenticationMiddleware from './authMiddleware/authMiddleware';
import refreshTokenRouter from './refreshTokenRouter';

const router = express.Router();

// Login routes
router.get('/login', getLoginPage);
router.post('/login', postLoginPage);

// Registration route
router.get('/register', getRegPage);
router.post('/register', postRegPage);

// Logout route
router.get('/logout', authenticationMiddleware, logout);

// Protected routes requiring authentication middleware
router.get('/dashboard', authenticationMiddleware, getDashboard);
router.get('/archive', authenticationMiddleware, getArchive);
router.get('/add-post', authenticationMiddleware, getAddPost);
router.get('/edit-post/:id', authenticationMiddleware, getEditPost);
router.get('/archived-posts/:id', authenticationMiddleware, getArchivedPosts);
router.get('/delete-post/confirmation/:id', authenticationMiddleware, getDeletePostConfirmation);

// Post-related routes
router.post('/add-post', authenticationMiddleware, postAddPost);
router.put('/edit-post/:id', authenticationMiddleware, postEditPost);
router.delete('/delete-post/:id', authenticationMiddleware, postDeletePost);

// Refresh token route
router.use(refreshTokenRouter);

export default router;

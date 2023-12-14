import express from 'express';
import {
  getNotFound,
  getServerError,
  getUnauthorized,
} from '../controllers/errorControllers';

const router = express.Router();

// Error routes
router.get('/notfound', getNotFound);

router.get('/serverError', getServerError);

router.get('/unauthorized', getUnauthorized);

export default router;

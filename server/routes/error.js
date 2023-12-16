import express from 'express';
import {
  getNotFound,
  getServerError,
  getUnauthorized,
  getBadRequest,
} from '../controllers/errorControllers';

const router = express.Router();

// Error routes
router.get('/notfound', getNotFound);

router.get('/serverError', getServerError);

router.get('/unauthorized', getUnauthorized);

router.get('/badRequest', getBadRequest);

export default router;

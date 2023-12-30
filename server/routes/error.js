import express from 'express';
import {
  getNotFound,
  getServerError,
  getUnauthorized,
  getBadRequest,
} from '../controllers/errorControllers';

const router = express.Router();

// Error routes
// Route to handle 404 Not Found errors
router.get('/notfound', getNotFound);

// Route to handle 500 Internal Server Error
router.get('/serverError', getServerError);

// Route to handle 401 Unauthorized errors
router.get('/unauthorized', getUnauthorized);

// Route to handle 400 Bad Request errors
router.get('/badRequest', getBadRequest);

export default router;

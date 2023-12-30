import express from 'express';
import refreshToken from '../controllers/refreshTokenController';

const refreshTokenRouter = express.Router();

// Route to handle refresh token requests
refreshTokenRouter.get('/refresh', refreshToken);

export default refreshTokenRouter;

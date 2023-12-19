import express from 'express';
import refreshToken from '../controllers/refreshTokenController';

const refreshTokenRouter = express.Router();

refreshTokenRouter.get('/refresh', refreshToken);

export default refreshTokenRouter;

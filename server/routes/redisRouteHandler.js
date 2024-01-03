/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cacheMiddleware from '../middleWare/cacheMiddleware';
import { getHomePage } from '../controllers/mainController';

const redisRouter = express.Router();

// apply caching middleware to the route
redisRouter.get('/', cacheMiddleware, getHomePage);

export default redisRouter;

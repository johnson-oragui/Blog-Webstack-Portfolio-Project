/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import { getHomePage } from '../controllers/mainController';

const redisRouter = express.Router();

export default redisRouter;

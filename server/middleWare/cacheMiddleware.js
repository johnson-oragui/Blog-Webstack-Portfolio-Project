import redisClient from '../dbUtils/redisClient';

const cacheMiddleware = async (req, res, next) => {
  try {
    const key = `__blog__.${req.originalUrl}`;

    const data = await redisClient.get(key);

    if (data !== null) {
      // send data as a response
      res.send(JSON.parse(data));
    } else {
      // if data not found in redis, move to the route handler
      next();
    }
  } catch (error) {
    console.error('error in cacheMiddleware route handler', error);
    next(error);
  }
};

export default cacheMiddleware;

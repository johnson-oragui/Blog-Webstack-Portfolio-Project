import * as redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    console.log('about to create redis client...');
    this.client = redis.createClient();
    console.log('client successfully created');
    this.client.ping();
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncSetex = promisify(this.client.setex).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
    this.asyncQuit = promisify(this.client.quit).bind(this.client);

    // Handle Redis client connection events
    this.client.on('connect', () => {
      console.log('Connected to redis server');
    });

    this.client.on('ready', () => {
      console.log('Redis client is ready');
    });

    this.client.on('error', (error) => {
      console.log(`Error Connecting to redis server: ${error.message}`);
    });

    this.client.on('close', () => {
      console.log('Closed connection');
    });
  }

  /**
  * Gets the value associated with the specified key from the Redis server.
  *
  * @param {string} key - The key to get the value for.
  * @returns {Promise<string>} A promise that resolves to the value associated with
  *                           the specified key, or null if the key does not exist.
  */
  async get(key) {
    try {
      if (this.client.status === 'end') {
        console.log('reconnecting to client');
        this.client = await redis.createClient();
      }
      const value = await this.asyncGet(key);
      return value;
    } catch (error) {
      console.error('error in asyncGet method', error.message);
      throw error;
    }
  }

  /**
  * Gets the value associated with the specified key from the Redis server.
  *
  * @param {string} key - The key to get the value for.
  * @returns {Promise<string>} A promise that resolves to the value associated with
  *                           the specified key, or null if the key does not exist.
  */
  async setex(key, value, duration) {
    try {
      return await this.asyncSetex(key, value, duration);
    } catch (error) {
      console.error('error in asyncSetex method', error.message);
      throw error;
    }
  }

  /**
  * Sets the value associated with the specified key in the Redis server.
  *
  * @param {string} key - The key to set the value for.
  * @param {string} value - The value to set.
  * @param {number} duration - The duration in seconds for which the key should exist.
  */
  async delete(key) {
    try {
      return await this.asyncDel(key);
    } catch (error) {
      console.error('error in asyncDel method', error.message);
      throw error;
    }
  }

  /**
  * Closes the connection to the Redis server.
  *
  * @returns {Promise<void>} A promise that resolves when the connection has been closed.
  */
  async close() {
    try {
      return await this.asyncQuit();
    } catch (error) {
      console.error('error in asyncQuit method', error.message);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;

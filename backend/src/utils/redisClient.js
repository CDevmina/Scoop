const Redis = require('redis');

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Keep retrying. Giving up leaves the client closed for good, which
        // breaks seat locking until the API restarts.
        reconnectStrategy: (retries) => Math.min(retries * 200, 5000)
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect().catch(console.error);

module.exports = redisClient;
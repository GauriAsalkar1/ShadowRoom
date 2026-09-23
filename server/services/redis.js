const Redis = require('ioredis');

let redisClient;

const initRedis = async () => {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);
  });

  return redisClient;
};

// Matchmaking queue operations
// Update addToQueue to include tempName
const addToQueue = async (mood, sessionId, tempId, tempName) => {
  const queueKey = `chat_queue:${mood}`;
  const userData = JSON.stringify({ sessionId, tempId, tempName, joinedAt: Date.now() });
  await redisClient.rpush(queueKey, userData);
  return { position: await redisClient.llen(queueKey) };
};

const findMatch = async (mood, currentSessionId) => {
  const queueKey = `chat_queue:${mood}`;
  const queueLength = await redisClient.llen(queueKey);
  
  if (queueLength === 0) return null;
  
  // Get first user from queue
  const matchData = await redisClient.lpop(queueKey);
  if (!matchData) return null;
  
  const match = JSON.parse(matchData);
  
  // Don't match with self
  if (match.sessionId === currentSessionId) {
    return await findMatch(mood, currentSessionId);
  }
  
  return match;
};

const removeFromQueue = async (mood, sessionId) => {
  const queueKey = `chat_queue:${mood}`;
  const queue = await redisClient.lrange(queueKey, 0, -1);
  
  for (let i = 0; i < queue.length; i++) {
    const item = JSON.parse(queue[i]);
    if (item.sessionId === sessionId) {
      await redisClient.lrem(queueKey, 1, queue[i]);
      break;
    }
  }
};

module.exports = { initRedis, addToQueue, findMatch, removeFromQueue, getRedis: () => redisClient };
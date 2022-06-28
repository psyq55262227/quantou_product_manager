import redis from 'redis';
const redisClient = redis.createClient('redis://:127.0.0.1:6379');

redisClient.on('ready', () => {
  console.log('redis is ready...');
});

redisClient.on('error', (err) => {
  console.log(err);
});

async function fun(callback, key, value) {
  return new Promise(async (res, rej) => {
    await redisClient.connect(); // 连接
    let ok = callback(key, value); // 成功ok
    await redisClient.quit(); // 关闭
    res(ok);
  });
}

const db = {
  async set(key, value) {
    return fun(
      async () => {
        return await redisClient.set(key, value);
      },
      key,
      value
    );
  },
  async get(key) {
    return fun(async () => {
      return await redisClient.get(key);
    }, key);
  },
  async del(key) {
    return fun(async () => {
      return await redisClient.del(key);
    }, key);
  },
};
// module.exports = { db };
export { db };

import 'dotenv/config';

const DEFAULT_VERSION = '0.0.1-test';
const DEFAULT_PORT = 8100;
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/proyecto-backend-ii';
const DEFAULT_COOKIE_NAME = 'coderShopToken';
const DEFAULT_JWT_SECRET = 'coderShopSecreto';

export default {
  VERSION: process.env.VERSION ?? DEFAULT_VERSION,
  PORT: process.env.PORT ?? DEFAULT_PORT,
  MONGO_URI: process.env.MONGO_URI ?? DEFAULT_MONGO_URI,
  COOKIE_NAME: process.env.COOKIE_NAME ?? DEFAULT_COOKIE_NAME,
  JWT_SECRET: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
}

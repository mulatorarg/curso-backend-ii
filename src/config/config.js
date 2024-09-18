import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT ?? 8000,
    MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/proyecto-backend-ii',
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_NAME: process.env.COOKIE_NAME?? "coderShopToken",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};

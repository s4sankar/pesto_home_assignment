const dotenv = require('dotenv');

dotenv.config({
    path: `${process.env.NODE_ENV}.env`
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
}
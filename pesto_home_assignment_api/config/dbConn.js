const mongoose = require('mongoose');
const config = require('./envConfig');

const connectDb = async () => {
    try {
        await mongoose.connect(config.DATABASE_URI);
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

module.exports = connectDb;
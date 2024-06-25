const express = require('express');
const app = express();
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDb = require('./config/dbConn');
const HttpStatusCode = require('./utils/httpStatusCode');
const errorHandler = require('./middleware/errorHandler');

// Connect to the database
connectDb();

// Custom Logger
app.use(logger);

// Handle Options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Orign Resource Sharing
app.use(cors(corsOptions));

// Built In Middleware for parsing JSON from request body
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

app.use('/api', require('./api/api'));

app.all('*', (req, res) => {
    res.status(HttpStatusCode.NOT_FOUND).json({ 'error': `${req.path} not found` });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});
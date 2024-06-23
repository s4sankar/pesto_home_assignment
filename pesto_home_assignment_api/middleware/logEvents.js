const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    let date = new Date();

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    let year = date.getFullYear();

    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

    const dateTime = `${formattedDate}`;
    const logItem = `${dateTime}- ${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '../logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '../logs'));
        }

        await fsPromise.appendFile(path.join(__dirname, `../logs/${logName}.log`), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method} ${req.headers.origin} ${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };
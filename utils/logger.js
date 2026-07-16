const fs = require("fs");
const path = require("path");
const winston = require("winston");

const logsDir = path.join(__dirname, "..", "logs");
fs.mkdirSync(logsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFile = path.join(logsDir, `test-run-${timestamp}.log`);

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: logFile, level: "debug" }),
    ],
});

function maskSecret(str) {
    if (!str) return str;
    if (str.length <= 4) return "***";
    return str.slice(0, 2) + "***" + str.slice(-2);
}

logger.maskSecret = maskSecret;
module.exports = logger;
module.exports.maskSecret = maskSecret;

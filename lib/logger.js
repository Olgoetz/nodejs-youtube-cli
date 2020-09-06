const winston = require('winston');

let logger;
const format = winston.format.cli();
const logLevel = process.env.YOUTUBECLI_DEBUG || 'info';

// If tests are being run deactivate log outputs to the console
if (process.env.NODE_ENV !== 'test') {
	logger = winston.createLogger({
		level: logLevel,
		format: format,
		transports: [new winston.transports.Console()],
	});
} else {
	logger = winston.createLogger({
		level: logLevel,
		format: format,
		silent: true,
	});
}

logger.debug('Debug mode activated');

module.exports = logger;

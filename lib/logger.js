const winston = require('winston');

let logger;

// If tests are being run deactivte log outputs to the console
if (process.env.NODE_ENV !== 'test') {
	logger = winston.createLogger({
		level: process.env.YOUTUBECLI_DEBUG || 'info',
		format: winston.format.cli(),
		transports: [new winston.transports.Console()],
	});
} else {
	logger = winston.createLogger({
		level: process.env.YOUTUBECLI_DEBUG || 'info',
		format: winston.format.cli(),
		silent: true,
	});
}

logger.debug('Debug mode activated');

module.exports = logger;

// NPM modules
const fs = require('fs');
const Configstore = require('configstore');

// Custom modules
const logger = require('./logger');
const { cliConfigFile } = require('./constants');

// Get an instance of configstore
const config = new Configstore(cliConfigFile);

/**
 * Check if a valid configuration file exists.
 * @param {string} config Absolute path where the config file is stored.
 * @returns {boolean} 'True' if a config file exists. Otherwise 'False' will be returned.
 */
const validateConfig = (configPath) => {
	logger.debug('in "validateConfig(configPath)"');
	try {
		if (fs.existsSync(configPath)) {
			logger.debug('Config file exists');
			return true;
		} else {
			logger.info('No config file exists. Run "youtube-cli config --help".');
			process.exit(1);
		}
	} catch (err) {
		logger.error(err);
	}
};

/**
 * Creates the config file
 * @param {string} dir Absolute path where the downloads are saved.
 * @returns {boolean} 'True' if a config file exists. Otherwise 'False' will be returned.
 */
const createConfig = (audioDir) => {
	logger.debug('in "createConfig(audioDir)"');
	logger.info('Creating config file.');
	config.set('audioDir', audioDir);
	logger.info('Config file set.');
	return true;
};

module.exports = {
	createConfig,
	validateConfig,
};

const fs = require('fs');
const logger = require('./logger');
const path = require('path');
const CONFIG = path.join(path.resolve(__dirname), '../config/default.json');

/**
 * Check if a valid configuration file exists.
 * @param {string} config Absolute path where the config file is stored.
 * @returns {boolean} 'True' if a config file exists. Otherwise 'False' will be returned.
 */
const validateConfig = (config) => {
	try {
		if (fs.existsSync(config)) {
			logger.debug('Config file exists');
			return true;
		} else {
			logger.info('No config file exists. Run "youtube-cli config --help".');
			return false;
		}
	} catch (err) {
		logger.error(err);
	}
};

/**
 * Creates the target folder store downloades.
 * @param {string} dir Absolute path where the downloads are saved.
 * @returns {boolean} 'True' if a config file has been created. Otherwise 'False' will be returned.
 */
const createFolder = (dir) => {
	if (fs.existsSync(dir)) {
		logger.info('audio folder already exists');
		return false;
	} else {
		fs.mkdir(dir, (err) => {
			if (err) throw err;
			logger.info('created');
		});
		return true;
	}
};

/**
 * Creates the config file
 * @param {string} dir Absolute path where the downloads are saved.
 * @returns {boolean} 'True' if a config file exists. Otherwise 'False' will be returned.
 */
const createConfig = (audioDir, config) => {
	// Create config object
	const configObject = {
		audioDir: audioDir,
	};
	const configJSON = JSON.stringify(configObject);
	try {
		// Write the config file containing the path the audios are saved
		fs.writeFileSync(config, configJSON);
	} catch (err) {
		logger.error(err);
		return false;
	}
	createFolder(configObject.audioDir);
	return true;
};

module.exports = {
	createConfig,
	validateConfig,
	createFolder,
	CONFIG,
};

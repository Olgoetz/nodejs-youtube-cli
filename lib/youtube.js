// NPM modules
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ora = require('ora');
const Configstore = require('configstore');

// Custom modules
const logger = require('./logger');

// Configure spinner
const spinner = ora({ indent: 9 });

// Get path name of config file (without suffix)
const { cliConfigFile } = require('./constants');
const downloadFolder = new Configstore(cliConfigFile);

/**
 * Get the title of the YouTube video/audio.
 * The return value is 'true' if a new folder has been created. Otherwise 'false' will be returned
 * if the folder already exists.
 * @param {string} url YouTube URL.
 * @returns {string} The title of the YouTube video/audio.
 */
const getInfo = async (url) => {
	logger.debug('in "getInfo(url)"');
	logger.info(`Getting metadata for ${url}`);
	try {
		const response = await ytdl.getBasicInfo(url);
		const info = response.videoDetails.title;
		logger.info(`Title: ${info}`);
		return info;
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
};

/**
 * Get a readable stream of the YouTube video/audio.
 * @param {string} url YouTube URL.
 * @returns {Promise} Promise object representing the stream.
 */
const getStream = async (url) => {
	logger.debug('in "getStream(url)"');
	logger.info(`Downloading from ${url} ...`);

	return new Promise((resolve, reject) => {
		process.env.NODE_ENV !== 'test' && spinner.start();
		spinner.color = 'yellow';
		spinner.text = 'Loading stream';
		const stream = ytdl(url, {
			quality: 'highestaudio',
			filter: (format) => format.container === 'mp4',
		});

		process.env.NODE_ENV !== 'test' && spinner.succeed();
		spinner.text = 'Converting stream into mp3';
		if (stream == null) throw Error('Stream could no be captured!');
		return resolve(stream);
	});
};

/**
 * Convert the stream to a valid mp3 and save it in the path of the config file.
 * @param {stream} stream Readable stream.
 * @returns {boolean} True if conversion to mp3 was successful.
 */
const convertToMp3 = async (stream, title) => {
	logger.debug('in "convertToMp3(stream,title)"');
	return new Promise((resolve, reject) => {
		ffmpeg({ source: stream })
			.on('start', () => {
				process.env.NODE_ENV !== 'test' && spinner.start();
			})
			.audioBitrate('192k')
			.on('end', function () {
				process.env.NODE_ENV !== 'test' && spinner.succeed();
				logger.info('Finished processing!');
				return resolve(true);
			})
			.on('error', (err) => {
				logger.error(err);
				return reject(false);
			})
			.save(`${downloadFolder.get('audioDir')}/${title}.mp3`);
	});
};

/**
 * Entry point for yargs.
 * @param {string} url YouTube URL.
 * @returns {boolean} True if the execution was successful.
 */

const main = async (url) => {
	logger.debug('in "main(url)"');
	const info = await getInfo(url);
	let stream;
	try {
		stream = await getStream(url);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
	try {
		await convertToMp3(stream, info);
		logger.info('File successfully saved!');
		return true;
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
};

module.exports = {
	getInfo,
	getStream,
	convertToMp3,
	main,
};

const ytdl = require('ytdl-core');
const config = require('config');
const logger = require('./logger');
const ffmpeg = require('fluent-ffmpeg');
const ora = require('ora');
const spinner = ora({ indent: 9 });

/**
 * Get the title of the YouTube video/audio.
 * The return value is 'true' if a new folder has been created. Otherwise 'false' will be returned
 * if the folder already exists.
 * @param {string} url YouTube URL.
 * @returns {string} The title of the YouTube video/audio.
 */
const getInfo = async (url) => {
	logger.info(`Getting metadata for ${url}`);
	const response = await ytdl.getBasicInfo(url);
	const info = response.videoDetails.title;
	logger.info(`Title: ${info}`);
	return info;
};

/**
 * Get a readable stream of the YouTube video/audio.
 * @param {string} url YouTube URL.
 * @returns {Promise} Promise object representing the stream.
 */
const getStream = async (url) => {
	logger.info(`Downloading from ${url} ...`);

	return new Promise((resolve, reject) => {
		process.env.NODE_ENV !== 'test' && spinner.start();
		spinner.color = 'yellow';
		spinner.text = 'Loading Stream';
		const stream = ytdl(url, {
			quality: 'highestaudio',
			filter: (format) => format.container === 'mp4',
		});

		process.env.NODE_ENV !== 'test' && spinner.succeed();
		spinner.text = 'Converting stream into mp3';
		return resolve(stream);
	});
};

/**
 * Convert the stream to a valid mp3 and save it in the path of the config file.
 * @param {stream} stream Readable stream.
 * @returns {boolean} True if conversion to mp3 was successful.
 */
const convertToMp3 = async (stream, title) => {
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
			.save(`${config.get('audioDir')}/${title}.mp3`)
			.on('error', (err) => {
				logger.error(err);
				return reject(false);
			});
	});
};

/**
 * Entry point for yargs.
 * @param {string} url YouTube URL.
 * @returns {boolean} True if the execution was successful.
 */
const main = async (url) => {
	const info = await getInfo(url);
	const stream = await getStream(url);
	await convertToMp3(stream, info);
	logger.info('File successfully saved!');
	return true;
};

module.exports = {
	getInfo,
	getStream,
	convertToMp3,
	main,
};

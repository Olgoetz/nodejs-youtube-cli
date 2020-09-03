const yargs = require('yargs');

// Handle debug mode
yargs.boolean(['v']);
if (yargs.argv.v) {
	process.env.YOUTUBECLI_DEBUG = 'debug';
}
const logger = require('./lib/logger');

// Custom modules
const init = require('./lib/init');
const youtube = require('./lib/youtube');

//****************************************************************************************************
// INIT CHECK
//****************************************************************************************************
init.validateConfig(init.CONFIG);

//****************************************************************************************************
// CONFIGURING YARGS
//****************************************************************************************************

// Basics

yargs.version('1.0.0');
yargs.scriptName('youtube-cli');
yargs.usage('Usage: $0 <cmd> [options]');

// Download the audio stream
yargs.command({
	command: 'download',
	describe: 'Download the audio stream from a YouTube URL',
	builder: {
		url: {
			describe: 'Youtube URL',
			demandOption: true,
			type: 'string',
		},
	},
	handler: (argv) => {
		const url = argv.url.replace(/\\/g, '');
		logger.debug(`URL: ${url}`);
		youtube.main(url);
	},
});

// Setup up the configuration file
yargs.command({
	command: 'config',
	describe: 'Create the folders for audio',
	builder: {
		audio: {
			describe: 'Path for storing audio files',
			demandOption: true,
			type: 'string',
		},
	},
	handler: (argv) => {
		init.createConfig(argv.audio, init.CONFIG);
	},
});

// Require one command
yargs.demandCommand(1, '');

// Parse all commands
yargs.parse();

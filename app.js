#!/usr/bin/env node

// NPM modulues
const figlet = require('figlet');
const yargs = require('yargs');
const chalk = require('chalk');

// Intro
console.clear();
console.log(
	chalk.blue(figlet.textSync('YouTube-Cli', { horizontalLayout: 'full' }))
);

// Check '-v' or '--verbose' has been passend in the cli input
const _arguments = process.argv;
if (_arguments.includes('-v') || _arguments.includes('--verbose')) {
	process.env.YOUTUBECLI_DEBUG = 'debug';
}

// Custom modules
const init = require('./lib/init');
const youtube = require('./lib/youtube');
const Configstore = require('configstore');
const { cliConfigFile } = require('./lib/constants');
const config = new Configstore(cliConfigFile);

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
		init.createConfig(argv.audio);
	},
});

// Enable verbose mode
yargs.option('verbose', {
	alias: 'v',
	type: 'boolean',
	description: 'Run with verbose logging',
}).argv;

// Require one command
yargs.demandCommand(1);

// Parse all commands
yargs.parse();

// Validate config
init.validateConfig(config.path);

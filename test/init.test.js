process.env.NODE_ENV = 'test';

// NPM modules
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const mock = require('mock-fs');
const Configstore = require('configstore');

// Custom modules
const { cliConfigFile } = require('../lib/constants');
const init = require('../lib/init');

// Enable sinon with chai
const expect = chai.expect;

// Setup the tests
chai.use(sinonChai);
beforeEach(() => {
	mock({
		'~/.config/configstore': {
			'youtube-cli.json': '{"audioDir":"myPath"}',
		},
	});
});

describe('validateConfig()', () => {
	it('should return true', () => {
		expect(init.validateConfig(`~/.config/configstore/${cliConfigFile}.json`))
			.to.be.true;
	});
	it('should call "process.exit()"', () => {
		const pe = sinon.stub(process, 'exit');
		const vc = sinon.fake(init.validateConfig);
		vc('files/nojson.json');

		expect(pe).to.have.been.called;
	});
});

describe('createConfig()', () => {
	it('should return true', () => {
		const config = new Configstore(cliConfigFile);
		init.createConfig('myAudioDir');
		expect(config.get('audioDir')).to.equal('myAudioDir');
	});
});

// Get rid off the mock filesystem
mock.restore();
